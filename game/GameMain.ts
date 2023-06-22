import GameController from "~/game/GameController";
import Simulation from "~/game/simulation/Simulation";
import GameStats from "~/game/GameStats";
import Point from "~/game/Point";

export type OnFrameCallback = (game: GameMain) => void;

export default class GameMain {

  private canvas: HTMLCanvasElement|null = null;
  private sim: Simulation = new Simulation(this);
  private controller: GameController = new GameController(this);
  private lastFrameTimestamp: number = performance.now();
  private pausedTimestamp: number = 0;
  private paused: boolean = false;
  private shutdown: boolean = false;
  private cursor: Point = { x: 0, y: 0 };
  private handleResizeListener = this.handleResize.bind(this);
  private handleMouseMoveListener = this.handleMouseMove.bind(this);
  private handleTouchMoveListener = this.handleTouchMove.bind(this);
  private handleBlurListener = this.pause.bind(this);
  private handleFocusListener = this.resume.bind(this);

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

  public getController(): GameController {
    return this.controller;
  }

  public pause(): void {
    if (this.paused)
      return;
    this.paused = true;
    this.pausedTimestamp = performance.now();
  }

  public resume(): void {
    if (!this.paused)
      return;
    this.paused = false;
    this.lastFrameTimestamp += performance.now() - this.pausedTimestamp;
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
    addEventListener('blur', this.handleBlurListener);
    addEventListener('focus', this.handleFocusListener);
    requestAnimationFrame(this.handleFrame.bind(this));
    return performance.now() - t;
  }

  public destroy(): number {
    const t = performance.now();
    removeEventListener('resize', this.handleResizeListener);
    removeEventListener('mousemove', this.handleMouseMoveListener);
    removeEventListener('touchmove', this.handleTouchMoveListener);
    removeEventListener('blur', this.handleBlurListener);
    removeEventListener('focus', this.handleFocusListener);
    this.shutdown = true;
    return performance.now() - t;
  }

  private preUpdate(dt: number): number {
    const t = performance.now();
    this.controller.onPreUpdate(dt);
    return performance.now() - t;
  }

  private update(dt: number): number {
    const t = performance.now();
    this.sim.step(dt);
    this.controller.onPostUpdate(dt);
    return performance.now() - t;
  }

  private draw(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    dt: number
  ): number {
    const t = performance.now();
    ctx.save();
    this.darkenFill(ctx);
    this.controller.onPreDraw(ctx, dt);
    this.sim.render(ctx, dt);
    this.controller.onPostDraw(ctx, dt);
    ctx.restore();
    return performance.now() - t;
  }

  private darkenFill(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'darken';
    ctx.fillStyle = 'rgb(0,0,0,0.25)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();
  }

  private handleMouseMove(e: MouseEvent) {
    const { x, y } = e;
    this.cursor.x = x;
    this.cursor.y = y;
  }

  private handleTouchMove(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    e.preventDefault();
    this.cursor.x = x;
    this.cursor.y = y;
  }

  public handleMouseDown(e: MouseEvent) {
    this.controller.onPressDown(e.x, e.y, e.button);
  }

  public handleMouseUp(e: MouseEvent) {
    this.controller.onPressUp(e.x, e.y, e.button);
  }

  public handleTouchDown(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    this.controller.onPressDown(x, y, 0);
  }

  public handleTouchUp(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    this.controller.onPressUp(x, y, 0);
  }

  private handleResize() {
    if (this.canvas) {
      const { innerWidth: width, innerHeight: height } = window;
      this.canvas.width = width;
      this.canvas.height = height;
      this.controller.onResize(width, height);
    }
  }

  private handleFrame(startTime: number) {
    const dt = startTime - this.lastFrameTimestamp;
    this.stats.updateTimeMs = this.preUpdate(dt / 1000) + this.update(dt / 1000);
    this.sim.clearBodiesOutsideRect(0, 0, window.innerWidth, window.innerHeight);
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