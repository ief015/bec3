import Point from "~/game/Point";

export default class Camera {

  private position: Point;
  private rotation: number;
  private zoom: number;
  private activeMatrix: DOMMatrix = new DOMMatrix();

  constructor(
    position: Point = { x: 0, y: 0 },
    rotation: number = 0,
    zoom: number = 1,
  ) {
    this.position = position;
    this.rotation = rotation;
    this.zoom = zoom;
  }

  public getPosition(): Readonly<Point> {
    return this.position;
  }

  public setPosition(position: Point): void {
    this.position.x = position.x;
    this.position.y = position.y;
  }

  public move(x: number, y: number): void;
  public move(delta: Point): void;
  public move(_x: Point|number, _y?: number): void {
    if (typeof _x == 'number') {
      const x = _x;
      const y = _y!;
      this.position.x += x;
      this.position.y += y;
    } else {
      const { x, y } = _x;
      this.position.x += x;
      this.position.y += y;
    }
  }

  public getRotate(): number {
    return this.rotation;
  }

  public setRotate(rotation: number): void {
    this.rotation = rotation;
  }

  public rotateRad(radians: number): void {
    this.rotation += radians;
  }

  public rotateDeg(degrees: number): void {
    this.rotation += degrees * Math.PI / 180;
  }

  public getZoom(): number {
    return this.zoom;
  }

  public setZoom(zoom: number): void {
    this.zoom = Math.max(Number.EPSILON, zoom);
  }

  public zoomBy(factor: number): void {
    this.zoom *= factor;
  }

  public getActiveMatrix(): Readonly<DOMMatrix> {
    return this.activeMatrix;
  }

  public transformPoint(point: Point): Point {
    const t = this.activeMatrix.inverse().transformPoint(point);
    return { x: t.x, y: t.y };
  }

  public apply(ctx: CanvasRenderingContext2D): void {
    const { position, rotation, zoom } = this;
    const halfw = ctx.canvas.width / 2 * zoom;
    const halfh = ctx.canvas.height / 2 * zoom;
    ctx.translate(halfw, halfh);
    ctx.rotate(rotation);
    ctx.translate(-position.x, -position.y);
    ctx.scale(zoom, zoom);
    this.activeMatrix = ctx.getTransform();
  }

}