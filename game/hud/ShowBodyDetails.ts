import GameEventHandler from "~/game/GameEventHandler";
import Point from '~/game/Point';
import Body from "~/game/simulation/Body";

export default class ShowBodyDetails extends GameEventHandler {

  private body: Body | undefined;

  public onPostUpdate(dt: number) {
    const bodies = this.getSimulation().getBodies();
    const cam = this.getCamera();
    const cursor = this.getCursor();
    this.body = bodies.findLast(b => {
      const probe = cam.toWorldSpace(cursor);
      const bodyPos: Point = { x: b.x, y: b.y };
      const dx = probe.x - bodyPos.x;
      const dy = probe.y - bodyPos.y;
      const dist = dx * dx + dy * dy;
      return dist < (b.radius * b.radius);
    });
  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {
    if (this.body) {
      ctx.save();
      ctx.resetTransform();
      ctx.translate(-32, 0);
      const pos = this.getCursor();
      ctx.fillStyle = '#A6ADBA';
      ctx.font = '12px sans-serif';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 4;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      // Draw from bottom, upwards
      ctx.translate(0, -15);
      const strRadius = `R ${this.body.radius.toFixed(3)}`;
      ctx.strokeText(strRadius, pos.x, pos.y);
      ctx.fillText(strRadius, pos.x, pos.y);
      ctx.translate(0, -15);
      const strMass = `M ${this.body.mass.toFixed(3)}`;
      ctx.strokeText(strMass, pos.x, pos.y);
      ctx.fillText(strMass, pos.x, pos.y);
      if (this.body.name) {
        ctx.translate(0, -15);
        ctx.strokeText(this.body.name, pos.x, pos.y);
        ctx.fillText(this.body.name, pos.x, pos.y);
      }
      ctx.restore();
    }
  }

}