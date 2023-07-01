import GameEventHandler from "~/game/GameEventHandler";
import Point from '~/game/Point';
import Body from "~/game/simulation/Body";

export default class ShowBodyDetails extends GameEventHandler {

  private body: Body | undefined;

  public onPostUpdate(dt: number) {
    const bodies = this.getSimulation().getBodies();
    const cam = this.getCamera();
    const cursor = this.getCursor();
    this.body = bodies.find(b => {
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
      ctx.fillStyle = '#999';
      ctx.font = '14px sans-serif';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 1.5;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;
      // Draw from bottom, upwards
      ctx.translate(0, -15);
      ctx.fillText(`R ${this.body.radius.toFixed(3)}`, pos.x, pos.y);
      ctx.translate(0, -15);
      ctx.fillText(`M ${this.body.mass.toFixed(3)}`, pos.x, pos.y);
      if (this.body.name) {
        ctx.translate(0, -15);
        ctx.fillText(this.body.name, pos.x, pos.y);
      }
      ctx.restore();
    }
  }

}