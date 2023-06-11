import GameEventHandler from "~/game/GameEventHandler";
import Point from "~/game/Point";
import Body from "~/game/simulation/Body";
import randomColorHex from "~/game/simulation/utils/randomColor";

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
    const cursor = this.getGame().getCursor();
    const { x: originX, y: originY } = this.pressOrigin;
    ctx.save();
    ctx.strokeStyle = '#333';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.arc(originX, originY, this.createRadius, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(originX, originY);
    ctx.lineTo(cursor.x, cursor.y);
    ctx.stroke();
    ctx.restore();
  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {
    this.drawCreateHint(ctx);
  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPressDown(x: number, y: number) {
    this.pressOrigin = { x, y };
  };

  public onPressUp(x: number, y: number) {
    if (this.pressOrigin) {
      const { x: originX, y: originY } = this.pressOrigin;
      const sim = this.getSimulation();
      const body = new Body(originX, originY);
      body.radius = this.createRadius;
      body.mass = this.createMass;
      body.vx = (originX - x) * this.createForce;
      body.vy = (originY - y) * this.createForce;
      body.strokeColor = randomColorHex();
      sim.getBodies().push(body);
    }
    this.pressOrigin = null;
  };

}