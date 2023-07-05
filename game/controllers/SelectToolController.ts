import GameEventHandler from "~/game/GameEventHandler";
import GameMain from "~/game/GameMain";
import Point from "~/game/Point";
import Rect from "~/game/Rect";
import LookToolController from "~/game/controllers/LookToolController";
import Body from "~/game/simulation/Body";

export default class SelectToolController extends GameEventHandler {

  private look: LookToolController;
  private selected: Body[] = [];
  private selecting: boolean = false;
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
      const radius = Math.max(body.radius * 1.5, 10 / cam.getZoom());
      ctx.beginPath();
      ctx.lineWidth = 1 / cam.getZoom();
      ctx.arc(body.x, body.y, radius, 0, 2 * Math.PI)
      ctx.stroke();
    }
  }

  private checkSelection(rect: Rect = this.getSelectionBox()) {
    const sim = this.getSimulation();
    const { x, y, w, h } = rect;
    const selected = sim.getBodies().filter(b => {
      const { x: bx, y: by, radius } = b;
      const left = bx - radius;
      const right = bx + radius;
      const top = by - radius;
      const bottom = by + radius;
      return !(left > x + w || right < x || top > y + h || bottom < y);
    });
    this.selected.splice(0, this.selected.length, ...selected);
  }

  public getSelected(): Body[] {
    return this.selected;
  }

  public getSelectionBox(): Rect {
    let { x, y } = this.selectBoxOrigin;
    let w = this.selectBoxEnd.x - x;
    let h = this.selectBoxEnd.y - y;
    if (w < 0) {
      x += w;
      w = -w;
    }
    if (h < 0) {
      y += h;
      h = -h;
    }
    return { x, y, w, h };
  };

  public isSelecting(): boolean {
    return this.selecting;
  }

  public hasSelection(): boolean {
    return this.selected.length > 0;
  }

  public clearSelection() {
    this.selected.splice(0, this.selected.length);
  }

  public deleteSelection() {
    const sim = this.getSimulation();
    sim.removeBodies(...this.selected);
    this.selected.splice(0, this.selected.length);
  }

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {
    ctx.save();
    if (this.selecting) {
      this.drawSelectionBox(ctx);
    }
    this.drawSelected(ctx);
    ctx.restore();
  }

  public onPressDown(x: number, y: number, button: number) {
    if (button == 0) {
      const cam = this.getCamera();
      const start = cam.toWorldSpace({ x, y });
      this.selectBoxOrigin = start;
      this.selectBoxEnd = start;
      this.selecting = true;
    }
  };

  public onPressUp(x: number, y: number, button: number) {
    if (button == 0) {
      if (this.selecting) {
        const cam = this.getCamera();
        this.selectBoxEnd = cam.toWorldSpace({ x, y });
        this.selecting = false;
        this.checkSelection();
      }
    }
  };

  public onCursorMove(x: number, y: number, dx: number, dy: number): void {
    if (this.selecting) {
      const cam = this.getCamera();
      this.selectBoxEnd = cam.toWorldSpace({ x, y });
    }
  }

  public onWheel(dx: number, dy: number, dz: number) {

  }

}