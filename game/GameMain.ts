import GameEventHandler from "~/game/GameEventHandler";
import GameStats from "~/game/GameStats";
import Simulation from "~/game/simulation/Simulation";
import Point from "~/game/Point";
import Camera from "~/game/Camera";

export type OnFrameCallback = (game: GameMain) => void;

export default class GameMain {

  private canvas: HTMLCanvasElement;
  private sim: Simulation = new Simulation();
  private controller?: GameEventHandler;
  private camera: Camera = new Camera();
  private lastFrameTimestamp: number = performance.now();
  private pausedTimestamp: number = 0;
  private paused: boolean = false;
  private shutdown: boolean = false;
  private cursor: Point = { x: 0, y: 0 };
  private stats: GameStats = {
    frameTimeMs: 0,
    updateTimeMs: 0,
    renderTimeMs: 0,
    fps: 0,
  }
  private handleResizeListener = this.handleResize.bind(this);
  private handleMouseMoveListener = this.handleMouseMove.bind(this);
  private handleTouchMoveListener = this.handleTouchMove.bind(this);
  private handleKeyDownListener = this.handleKeyDown.bind(this);
  private handleKeyUpListener = this.handleKeyUp.bind(this);
  private handleBlurListener = this.pause.bind(this);
  private handleFocusListener = this.resume.bind(this);
  private onFrameCb?: OnFrameCallback;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setCanvas(canvas);
  }

  public getCursor(): Readonly<Point> {
    return this.cursor;
  }

  public getCursorCamera(): Readonly<Point> {
    return this.camera.toCameraSpace(this.cursor);
  }

  public getStats(): Readonly<GameStats> {
    return this.stats;
  }

  public getSimulation(): Simulation {
    return this.sim;
  }

  public getController<T extends GameEventHandler>(): T|undefined {
    return this.controller as T|undefined;
  }

  public setController<TGameController extends GameEventHandler>(
    controllerType?: { new(...args: any[]): TGameController }
  ): TGameController|undefined {
    return this.controller = controllerType !== undefined ?
      new controllerType(this) :
      undefined;
  }

  public getCamera(): Camera {
    return this.camera;
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
    this.camera.setPosition(window.innerWidth / 2, window.innerHeight / 2);
    this.handleResizeListener();
  }

  public start(onFrameCb?: OnFrameCallback): number {
    const t = performance.now();
    this.onFrameCb = onFrameCb;
    addEventListener('resize', this.handleResizeListener);
    addEventListener('mousemove', this.handleMouseMoveListener);
    addEventListener('touchmove', this.handleTouchMoveListener);
    addEventListener('keydown', this.handleKeyDownListener);
    addEventListener('keyup', this.handleKeyUpListener);
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
    removeEventListener('keydown', this.handleKeyDownListener);
    removeEventListener('keyup', this.handleKeyUpListener);
    removeEventListener('blur', this.handleBlurListener);
    removeEventListener('focus', this.handleFocusListener);
    this.shutdown = true;
    return performance.now() - t;
  }

  private preUpdate(dt: number): number {
    const t = performance.now();
    //this.sim.clearBodiesOutsideRect(0, 0, window.innerWidth, window.innerHeight);
    //this.camera.rotateRad(dt);
    this.controller?.onPreUpdate(dt);
    return performance.now() - t;
  }

  private update(dt: number): number {
    const t = performance.now();
    this.sim.step(dt);
    this.controller?.onPostUpdate(dt);
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
    this.camera.apply(ctx);
    this.controller?.onPreDraw(ctx, dt);
    this.sim.render(ctx, dt);
    this.controller?.onPostDraw(ctx, dt);
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
    const { x: lx, y: ly } = this.cursor;
    const dx = x - lx;
    const dy = y - ly;
    this.cursor.x = x;
    this.cursor.y = y;
    this.controller?.onCursorMove(x, y, dx, dy);
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const { clientX: x, clientY: y } = e.touches[0];
    const { x: lx, y: ly } = this.cursor;
    this.cursor.x = x;
    this.cursor.y = y;
    this.controller?.onCursorMove(x, y, x - lx, y - ly);
  }

  public handleMouseDown(e: MouseEvent) {
    this.controller?.onPressDown(e.x, e.y, e.button);
  }

  public handleMouseUp(e: MouseEvent) {
    this.controller?.onPressUp(e.x, e.y, e.button);
  }

  public handleTouchDown(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    this.controller?.onPressDown(x, y, 0);
  }

  public handleTouchUp(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    this.controller?.onPressUp(x, y, 0);
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.controller?.onKeyDown(e.key);
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.controller?.onKeyUp(e.key);
  }

  public handleWheel(e: WheelEvent) {
    const { deltaX, deltaY, deltaZ } = e;
    this.controller?.onWheel(deltaX, deltaY, deltaZ);
  }

  private handleResize() {
    if (this.canvas) {
      const { innerWidth: width, innerHeight: height } = window;
      this.canvas.width = width;
      this.canvas.height = height;
      this.controller?.onResize(width, height);
    }
  }

  private handleFrame(startTime: number) {
    const dt = startTime - this.lastFrameTimestamp;
    this.stats.updateTimeMs = this.preUpdate(dt / 1000) + this.update(dt / 1000);
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