import GameEventHandler from "~/game/GameEventHandler";
import GameStats from "~/game/GameStats";
import Simulation from "~/game/simulation/Simulation";
import Point from "~/game/Point";
import Camera from "~/game/Camera";
import GameEventManager from "~/game/GameEventManager";
import ShowBodyDetails from "~/game/hud/ShowBodyDetails";

export type OnFrameCallback = (game: GameMain) => void;

export default class GameMain {

  private static _instance?: GameMain;

  public static getInstance(): GameMain {
    if (!GameMain._instance) {
      throw new Error('GameMain not initialized');
    }
    return GameMain._instance;
  }

  public static newInstance(
    canvas: HTMLCanvasElement,
    onFrameCb: OnFrameCallback
  ): GameMain {
    GameMain._instance?.destroy();
    GameMain._instance = new GameMain(canvas);
    GameMain._instance.start(onFrameCb);
    return GameMain._instance;
  }

  public static destroyInstance(): void {
    GameMain._instance?.destroy();
    GameMain._instance = undefined;
  }

  public static isInitialized(): boolean {
    return !!GameMain._instance;
  }

  private canvas: HTMLCanvasElement;
  private sim: Simulation = new Simulation();
  private controller?: GameEventHandler;
  private bodyDetailer: ShowBodyDetails = new ShowBodyDetails(this);
  private events: GameEventManager = new GameEventManager(this);
  private camera: Camera = new Camera();
  private lastFrameTimestamp: number = performance.now();
  private paused: boolean = false;
  private pausedBlurred: boolean = false;
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
  private handleBlurListener = this.handleBlur.bind(this);
  private handleFocusListener = this.handleFocus.bind(this);
  private onFrameCb?: OnFrameCallback;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setCanvas(canvas);
    this.events.addHandler(this.bodyDetailer);
  }

  public getCursor(): Readonly<Point> {
    return this.cursor;
  }

  public getCursorCamera(): Readonly<Point> {
    return this.camera.toWorldSpace(this.cursor);
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
    const controller = controllerType !== undefined ?
      new controllerType(this) :
      undefined;
    this.controller?.onDeactivated();
    this.controller = controller;
    this.controller?.onActivated();
    return controller;
  }

  public getCamera(): Camera {
    return this.camera;
  }

  public getEvents(): GameEventManager {
    return this.events;
  }

  public pause(): void {
    this.paused = true;
  }

  public resume(): void {
    this.paused = false;
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
    this.events.onPreUpdate(dt);
    return performance.now() - t;
  }

  private update(dt: number): number {
    const t = performance.now();
    this.sim.step(dt);
    this.controller?.onPostUpdate(dt);
    this.events.onPostUpdate(dt);
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
    this.events.onPreDraw(ctx, dt);
    this.sim.render(ctx, dt);
    this.controller?.onPostDraw(ctx, dt);
    this.events.onPostDraw(ctx, dt);
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
    this.events.onCursorMove(x, y, dx, dy);
  }

  private handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const { clientX: x, clientY: y } = e.touches[0];
    const { x: lx, y: ly } = this.cursor;
    this.cursor.x = x;
    this.cursor.y = y;
    this.controller?.onCursorMove(x, y, x - lx, y - ly);
    this.events.onCursorMove(x, y, x - lx, y - ly);
  }

  public handleMouseDown(e: MouseEvent) {
    this.controller?.onPressDown(e.x, e.y, e.button);
    this.events.onPressDown(e.x, e.y, e.button);
  }

  public handleMouseUp(e: MouseEvent) {
    this.controller?.onPressUp(e.x, e.y, e.button);
    this.events.onPressUp(e.x, e.y, e.button);
  }

  public handleTouchDown(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    this.controller?.onPressDown(x, y, 0);
    this.events.onPressDown(x, y, 0);
  }

  public handleTouchUp(e: TouchEvent) {
    const { clientX: x, clientY: y } = e.touches[0];
    this.controller?.onPressUp(x, y, 0);
    this.events.onPressUp(x, y, 0);
  }

  private handleKeyDown(e: KeyboardEvent) {
    this.controller?.onKeyDown(e.key);
    this.events.onKeyDown(e.key);
  }

  private handleKeyUp(e: KeyboardEvent) {
    this.controller?.onKeyUp(e.key);
    this.events.onKeyUp(e.key);
  }

  public handleWheel(e: WheelEvent) {
    const { deltaX, deltaY, deltaZ } = e;
    this.controller?.onWheel(deltaX, deltaY, deltaZ);
    this.events.onWheel(deltaX, deltaY, deltaZ);
  }

  private handleResize() {
    if (this.canvas) {
      const { innerWidth: width, innerHeight: height } = window;
      this.canvas.width = width;
      this.canvas.height = height;
      this.controller?.onResize(width, height);
      this.events.onResize(width, height);
    }
  }

  private handleBlur() {
    this.pausedBlurred = this.paused;
    this.pause();
  }

  private handleFocus() {
    if (!this.pausedBlurred) {
      this.lastFrameTimestamp = performance.now();
      this.resume();
    }
  }

  private handleFrame(startTime: number) {
    const dt = this.paused ? 0 : startTime - this.lastFrameTimestamp;
    const dtSec = dt / 1000;
    this.stats.updateTimeMs = this.preUpdate(dtSec) + this.update(dtSec);
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        this.stats.renderTimeMs = this.draw(this.canvas, ctx, dtSec);
      }
    }
    this.stats.frameTimeMs = performance.now() - startTime;
    this.stats.fps = 1000 / (startTime - this.lastFrameTimestamp);
    this.lastFrameTimestamp = startTime;
    if (this.shutdown)
      return;
    requestAnimationFrame(this.handleFrame.bind(this));
    this.onFrameCb?.(this);
  }

}