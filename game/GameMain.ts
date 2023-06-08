import Point from "~/game/Point";
import Body from "~/game/simulation/Body";
import GameStats from "~/game/simulation/GameStats";
import Simulation from "~/game/simulation/Simulation";
import randomColorHex from "~/game/simulation/util/randomColor";

export type OnFrameCallback = (game: GameMain) => void;

export default class GameMain {

  private canvas: HTMLCanvasElement|null = null;
  private lastFrameTimestamp: number = performance.now();
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
  }

  private onFrameCb?: OnFrameCallback;

  constructor(canvas: HTMLCanvasElement) {
    this.setCanvas(canvas);
  }

  public getCursor(): Point {
    return this.cursor;
  }

  public getStats(): GameStats {
    return { ...this.stats };
  }

  public getSimulation(): Simulation {
    return this.sim;
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

  private handleMouseMove(e: MouseEvent) {
    this.cursor.x = e.x;
    this.cursor.y = e.y;
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    this.cursor.x = e.touches[0].clientX;
    this.cursor.y = e.touches[0].clientY;
  }

  public handleClick(e: MouseEvent) {
    const body = new Body(e.x, e.y);
    body.radius = 2;
    body.mass = 1;
    body.vx = 0;
    body.vy = 0;
    body.strokeColor = randomColorHex();
    this.sim.getBodies().push(body);
  }

  private handleResize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  private handleFrame(startTime: number) {
    const dt = startTime - this.lastFrameTimestamp;
    this.stats.updateTimeMs = this.update(dt / 1000);
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        this.stats.renderTimeMs = this.draw(this.canvas, ctx, dt / 1000);
      }
    }
    this.stats.frameTimeMs = performance.now() - startTime;
    this.stats.fps = 1000 / (startTime - this.lastFrameTimestamp);
    this.lastFrameTimestamp = startTime;
    if (this.paused || this.shutdown)
      return;
    requestAnimationFrame(this.handleFrame.bind(this));
    this.onFrameCb?.(this);
  }

}