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
      const cam = this.getCamera();
      cam.move(dx, dy);
    }
  }

  public onWheel(dx: number, dy: number, dz: number) {
    const cam = this.getCamera();
    const zoom = Math.pow(1.1, dy < 0 ? 1 : -1)
    cam.zoomBy(zoom, cam.toCameraSpace(this.getCursor()));
  }

}