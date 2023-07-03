import GameEventHandler from "~/game/GameEventHandler";
import GameMain from "~/game/GameMain";
import Point from "~/game/Point";
import LookToolController from "~/game/controllers/LookToolController";
import Body from "~/game/simulation/Body";

export default class SelectToolController extends GameEventHandler {

  private look: LookToolController;
  private selected: Body[] = [];
  private isSelecting: boolean = false;
  private selectBoxOrigin: Point = { x: 0, y: 0 };
  private selectBoxEnd: Point = { x: 0, y: 0 };

  constructor(game: GameMain) {
    super(game);
    this.look = new LookToolController(game);
    this.look.setMoveButton(2);
    game.getEvents().addHandler(this.look);
  }

  public onDeactivated(): void {
    this.getGame().getEvents().removeHandler(this.look);
  }

  private drawSelectionBox(ctx: CanvasRenderingContext2D, style: string = '#555') {
    const cam = this.getCamera();
    ctx.strokeStyle = style;
    ctx.lineCap = 'butt';
    ctx.lineWidth = 1 / cam.getZoom();
    const { x, y } = this.selectBoxOrigin;
    const w = this.selectBoxEnd.x - x;
    const h = this.selectBoxEnd.y - y;
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
    
  }

  private drawSelected(ctx: CanvasRenderingContext2D, style: string = '#555') {
    const cam = this.getCamera();
    ctx.strokeStyle = style;
    ctx.lineCap = 'butt';
    for (const body of this.selected) {
      const radius = Math.max(body.radius * 1.25, 10 / cam.getZoom());
      ctx.beginPath();
      ctx.lineWidth = 1 / cam.getZoom();
      ctx.arc(body.x, body.y, radius, 0, 2 * Math.PI)
      ctx.stroke();
    }
  }

  private checkSelection() {
    const sim = this.getSimulation();
    const { x, y } = this.selectBoxOrigin;
    const w = this.selectBoxEnd.x - x;
    const h = this.selectBoxEnd.y - y;
    const selected = sim.getBodies().filter(b => {
      const { x: bx, y: by, radius } = b;
      let left = bx - radius;
      let right = bx + radius;
      let top = by - radius;
      let bottom = by + radius;
      if (left > right) {
        [left, right] = [right, left];
      }
      if (top > bottom) {
        [top, bottom] = [bottom, top];
      }
      return !(left > x + w || right < x || top > y + h || bottom < y);
    });
    this.selected.splice(0, this.selected.length, ...selected);
  }

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {
    ctx.save();
    if (this.isSelecting) {
      this.drawSelectionBox(ctx);
    }
    this.drawSelected(ctx);
    ctx.restore();
  }

  public onPressDown(x: number, y: number, button: number) {
    if (button == 0) {
      this.isSelecting = true;
      const cam = this.getCamera();
      const start = cam.toWorldSpace({ x, y });
      this.selectBoxOrigin = start;
      this.selectBoxEnd = start;
      this.checkSelection();
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == 0) {
      if (this.isSelecting) {
        const cam = this.getCamera();
        this.selectBoxEnd = cam.toWorldSpace({ x, y });
        this.isSelecting = false;
      }
    }
  };

  public onCursorMove(x: number, y: number, dx: number, dy: number): void {
    if (this.isSelecting) {
      const cam = this.getCamera();
      this.selectBoxEnd = cam.toWorldSpace({ x, y });
      this.checkSelection();
    }
  }

  public onWheel(dx: number, dy: number, dz: number) {

  }

}