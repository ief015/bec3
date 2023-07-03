import GameEventHandler from "~/game/GameEventHandler";

export default class LookToolController extends GameEventHandler {

  private moveButton: number = 0;
  private moving: boolean = false;

  public onActivated(): void {
  }

  public onDeactivated(): void {
  
  }

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPressDown(x: number, y: number, button: number) {
    if (button == this.moveButton) {
      this.moving = true;
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == this.moveButton) {
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
    cam.zoomBy(zoom, cam.toWorldSpace(this.getCursor()));
  }

}