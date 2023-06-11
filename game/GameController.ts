import GameEventHandler from "~/game/GameEventHandler";
import Point from "~/game/Point";
import Body from "~/game/simulation/Body";
import randomBodyColor from "~/game/simulation/utils/randomColor";

export default class GameController extends GameEventHandler {

  private pressOrigin: Point|null = null;
  private createMass = 1;
  private createRadius = 4;
  private createForce = 5;

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  private drawCreateHint(ctx: CanvasRenderingContext2D) {
    if (!this.pressOrigin)
      return;
    const sim = this.getSimulation();
    const { x: cursorX, y: cursorY } = this.getGame().getCursor();
    const { x: originX, y: originY } = this.pressOrigin;
    ctx.save();
    ctx.strokeStyle = '#555';
    ctx.lineCap = 'round';
    // Body origin
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.arc(originX, originY, this.createRadius, 0, 2 * Math.PI)
    ctx.stroke();
    // Velocity vector
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(originX, originY);
    ctx.lineTo(cursorX, cursorY);
    ctx.stroke();
    // Trajectory
    const traceBody = new Body(originX, originY);
    traceBody.radius = this.createRadius;
    traceBody.mass = this.createMass;
    traceBody.vx = (originX - cursorX) * this.createForce;
    traceBody.vy = (originY - cursorY) * this.createForce;
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.moveTo(originX, originY);
    for (const p of sim.tracePath(traceBody)) {
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {
    this.drawCreateHint(ctx);
  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPressDown(x: number, y: number, button: number) {
    if (button == 0) {
      this.pressOrigin = { x, y };
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == 0) {
      if (this.pressOrigin) {
        const { x: originX, y: originY } = this.pressOrigin;
        const sim = this.getSimulation();
        const body = new Body(originX, originY);
        body.radius = this.createRadius;
        body.mass = this.createMass;
        body.vx = (originX - x) * this.createForce;
        body.vy = (originY - y) * this.createForce;
        body.strokeColor = randomBodyColor();
        sim.getBodies().push(body);
      }
      this.pressOrigin = null;
    }
  };

}