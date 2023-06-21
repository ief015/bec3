import GameEventHandler from "~/game/GameEventHandler";
import Point from "~/game/Point";
import Body from "~/game/simulation/Body";
import randomBodyColor from "~/game/simulation/utils/randomColor";

export default class GameController extends GameEventHandler {

  private pressOrigin: Point|null = null;

  private mass: number = 1;
  private radius: number = 4;
  private force: number = 5;

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  private drawCreateHint(ctx: CanvasRenderingContext2D, style: string = '#555') {
    const sim = this.getSimulation();
    const { x: cursorX, y: cursorY } = this.getGame().getCursor();
    ctx.save();
    ctx.strokeStyle = style;
    ctx.lineCap = 'round';
    if (this.pressOrigin) {
      const { x: originX, y: originY } = this.pressOrigin;
      // Body origin
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(originX, originY, this.radius, 0, 2 * Math.PI)
      ctx.stroke();
      // Velocity vector
      ctx.beginPath();
      ctx.lineWidth = 2;
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
      ctx.lineWidth = 0.5;
      ctx.moveTo(originX, originY);
      for (const p of sim.tracePath(traceBody)) {
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    } else {
      // Body cursor
      ctx.beginPath();
      ctx.lineWidth = 0.5;
      ctx.arc(cursorX, cursorY, this.radius, 0, 2 * Math.PI)
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
      this.pressOrigin = { x, y };
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == 0) {
      if (this.pressOrigin) {
        const { x: originX, y: originY } = this.pressOrigin;
        const sim = this.getSimulation();
        const body = new Body(originX, originY);
        body.radius = this.radius;
        body.mass = this.mass;
        body.vx = (originX - x) * this.force;
        body.vy = (originY - y) * this.force;
        body.strokeColor = randomBodyColor();
        sim.pushBodies(body);
      }
      this.pressOrigin = null;
    }
  };

}