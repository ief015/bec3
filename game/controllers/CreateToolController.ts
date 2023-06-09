import GameEventHandler from "~/game/GameEventHandler";
import GameMain from "~/game/GameMain";
import Point from "~/game/Point";
import LookToolController from "~/game/controllers/LookToolController";
import Body from "~/game/simulation/Body";

export default class CreateToolController extends GameEventHandler {

  private look: LookToolController;
  private pressOrigin: Point|null = null;

  private radius: number = 5;
  private mass: number = 100000;
  private force: number = 5;

  constructor(game: GameMain) {
    super(game);
    const radius = sessionStorage.getItem('CreateToolController.radius');
    const mass = sessionStorage.getItem('CreateToolController.mass');
    const force = sessionStorage.getItem('CreateToolController.force');
    if (radius) {
      this.radius = Number(radius);
    }
    if (mass) {
      this.mass = Number(mass);
    }
    if (force) {
      this.force = Number(force);
    }
    this.look = new LookToolController(game);
    this.look.setMoveButton(2);
    game.getEvents().addHandler(this.look);
  }

  public onDeactivated(): void {
    this.getGame().getEvents().removeHandler(this.look);
  }

  public getRadius(): number {
    return this.radius;
  }

  public setRadius(radius: number): number {
    this.radius = Math.max(0, radius);
    sessionStorage.setItem('CreateToolController.radius', String(this.radius));
    return this.radius;
  }

  public getMass(): number {
    return this.mass;
  }

  public setMass(mass: number): number {
    this.mass = Math.max(Number.EPSILON, mass);
    sessionStorage.setItem('CreateToolController.mass', String(this.mass));
    return this.mass;
  }

  public getForce(): number {
    return this.force;
  }

  public setForce(force: number): number {
    this.force = force;
    sessionStorage.setItem('CreateToolController.force', String(this.force));
    return this.force;
  }

  public spawnBody(x: number, y: number, launchX: number, launchY: number) {
    const { x: tx, y: ty } = { x: launchX, y: launchY };
    const { x: originX, y: originY } = { x, y };
    const sim = this.getSimulation();
    const body = new Body(originX, originY);
    body.radius = this.radius;
    body.mass = this.mass;
    body.vx = (originX - tx) * this.force;
    body.vy = (originY - ty) * this.force;
    body.strokeColor = randomColorStyle();
    sim.pushBodies(body);
  }

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  private drawCreateHint(ctx: CanvasRenderingContext2D, style: string = '#555') {
    const sim = this.getSimulation();
    const cam = this.getCamera();
    const game = this.getGame();
    const { x: cursorX, y: cursorY } = game.getCursorCamera();
    ctx.save();
    ctx.strokeStyle = style;
    ctx.lineCap = 'round';
    if (this.pressOrigin) {
      const { x: originX, y: originY } = this.pressOrigin;
      // Body origin
      ctx.beginPath();
      ctx.lineWidth = 0.5 / cam.getZoom();
      ctx.arc(originX, originY, this.radius, 0, 2 * Math.PI)
      ctx.stroke();
      // Velocity vector
      ctx.beginPath();
      ctx.lineWidth = 2 / cam.getZoom();
      ctx.moveTo(originX, originY);
      ctx.lineTo(cursorX, cursorY);
      ctx.stroke();
      // Trajectory
      const traceBody = new Body(originX, originY);
      traceBody.radius = this.radius;
      traceBody.mass = this.mass;
      traceBody.vx = (originX - cursorX) * this.force;
      traceBody.vy = (originY - cursorY) * this.force;
      ctx.beginPath();
      ctx.lineWidth = 0.5 / cam.getZoom();
      ctx.moveTo(originX, originY);
      for (const p of sim.tracePath(traceBody)) {
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    } else {
      // Body cursor
      ctx.beginPath();
      ctx.lineWidth = 0.5 / cam.getZoom();
      ctx.arc(cursorX, cursorY, this.radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
    ctx.restore();
  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {
    this.drawCreateHint(ctx);
  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPressDown(x: number, y: number, button: number) {
    if (button == 0) {
      this.pressOrigin = this.getCamera().toWorldSpace({ x, y });
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == 0) {
      if (this.pressOrigin) {
        const cam = this.getCamera();
        const { x: launchX, y: launchY } = cam.toWorldSpace({ x, y });
        this.spawnBody(this.pressOrigin.x, this.pressOrigin.y, launchX, launchY);
      }
      this.pressOrigin = null;
    }
  };

}