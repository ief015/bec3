import GameEventHandler from "~/game/GameEventHandler";
import Point from "~/game/Point";

export default class LookToolController extends GameEventHandler {

  private moving: boolean = false;

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPressDown(x: number, y: number, button: number) {
    if (button == 0) {
      this.moving = true;
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == 0) {
      this.moving = false;
    }
  };

  public onCursorMove(x: number, y: number, dx: number, dy: number): void {
    if (this.moving) {
      const t1 = this.getCamera().transformPoint({ x, y });
      const t2 = this.getCamera().transformPoint({ x: x - dx, y: y - dy });
      dx = t2.x - t1.x;
      dy = t2.y - t1.y;
      this.getGame().getCamera().move(dx, dy);
    }
  }

  public onWheel(dx: number, dy: number, dz: number) {
    this.getGame().getCamera().zoomBy(1 - dy / 1000);
  }

}