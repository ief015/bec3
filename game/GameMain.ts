import Point from "~/game/Point";
import Body from "~/game/simulation/Body";
import GameStats from "~/game/simulation/GameStats";
import Simulation from "~/game/simulation/Simulation";

export type OnFrameCallback = () => void;

export default class GameMain {

  private canvas: HTMLCanvasElement|null = null;
  private lastFrameTimestamp: number = -Infinity;
  private nextUpdateTimestamp: number = -Infinity;
  private updateRateUser: number = 60;
  private updateRateMs: number = 1000 / this.updateRateUser;
  private paused: boolean = false;
  private shutdown: boolean = false;
  private cursor: Point = { x: 0, y: 0 };
  private sim: Simulation = new Simulation(this);
  private handleResizeListener = this.handleResize.bind(this);
  private handleMouseMoveListener = this.handleMouseMove.bind(this);
  private handleTouchMoveListener = this.handleTouchMove.bind(this);

  private stats: GameStats = {
    frameTimeMs: 0,
    updateTimeMs: 0,
    renderTimeMs: 0,
    fps: 0,
    ups: 0,
  }

  private onFrameCb?: OnFrameCallback;

  constructor(canvas: HTMLCanvasElement) {
    this.setCanvas(canvas);
  }

  public getCursor(): Point {
    return this.cursor;
  }

  public getUpdateRate(): number {
    return this.updateRateUser;
  }

  public setUpdateRate(rate: number): void {
    this.updateRateUser = Math.max(0, rate);
    this.updateRateMs = 1000 / this.updateRateUser;
  }

  public getStats(): GameStats {
    return { ...this.stats };
  }

  public getBodies(): Body[] {
    return this.sim.getBodies();
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
    requestAnimationFrame(this.handleFrame.bind(this));
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.handleResizeListener();
  }

  public start(onFrameCb?: OnFrameCallback): number {
    const t = performance.now();
    this.onFrameCb = onFrameCb;
    addEventListener('resize', this.handleResizeListener);
    addEventListener('mousemove', this.handleMouseMoveListener);
    addEventListener('touchmove', this.handleTouchMoveListener);
    requestAnimationFrame(this.handleFrame.bind(this));
    return performance.now() - t;
  }

  public destroy(): number {
    const t = performance.now();
    removeEventListener('resize', this.handleResizeListener);
    removeEventListener('mousemove', this.handleMouseMoveListener);
    removeEventListener('touchmove', this.handleTouchMoveListener);
    this.shutdown = true;
    return performance.now() - t;
  }

  private update(dt: number): number {
    const t = performance.now();
    this.sim.step(dt);
    return performance.now() - t;
  }

  private draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    dt: number
  ): number {
    const t = performance.now();
    this.darkenFill(ctx);
    ctx.save();
    this.sim.render(ctx, dt);
    ctx.restore();
    return performance.now() - t;
  }

  private darkenFill(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'darken';
    ctx.fillStyle = "rgb(0,0,0,0.2)";
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
  }

  public handleMouseMove(e: MouseEvent) {
    this.cursor.x = e.x;
    this.cursor.y = e.y;
  }

  public handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.cursor.x = e.touches[0].clientX;
    this.cursor.y = e.touches[0].clientY;
  }

  private handleResize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  private handleFrame(time: number) {
    if (time >= this.nextUpdateTimestamp) {
      this.stats.updateTimeMs = this.update(this.updateRateMs/1000);
      this.nextUpdateTimestamp = time + this.updateRateMs;
      if (this.canvas) {
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
          const dt = time - this.lastFrameTimestamp;
          this.stats.renderTimeMs = this.draw(this.canvas, ctx, dt/1000);
        }
      }
      this.lastFrameTimestamp = time;
      this.stats.frameTimeMs = performance.now() - time;
      this.stats.fps = 1000 / this.stats.frameTimeMs;
      this.stats.ups = 1000 / Math.max(this.updateRateMs, this.stats.updateTimeMs);
    }
    if (this.paused || this.shutdown)
      return;
    this.onFrameCb?.();
    requestAnimationFrame(this.handleFrame.bind(this));
  }

}