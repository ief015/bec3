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
      const cam = this.getCamera();
      //const pos = cam.toScreenSpace(this.body);
      const pos = this.getCursor();
      ctx.fillStyle = '#777';
      ctx.font = '14px sans-serif';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 1;
      ctx.translate(-32, -32);
      ctx.fillText(`M ${this.body.mass.toFixed(3)}`, pos.x, pos.y);
      ctx.fillText(`R ${this.body.radius.toFixed(3)}`, pos.x, pos.y + 15);
      ctx.restore();
    }
  }

}