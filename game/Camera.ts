import Point from "~/game/Point";

export default class Camera {

  private rotation: number;
  private zoom: number;

  private transform: DOMMatrix = new DOMMatrix();

  constructor(
    position: Point = { x: 0, y: 0 },
    rotation: number = 0,
    zoom: number = 1,
  ) {
    this.rotation = rotation;
    this.zoom = zoom;
    this.transform.translateSelf(position.x, position.y);
    this.transform.rotateSelf(rotation);
    this.transform.scaleSelf(zoom, zoom);
  }

  public getPosition(): Point {
    const pos = this.transform.transformPoint({ x: 0, y: 0 });
    return { x: pos.x, y: pos.y };
  }

  public setPosition(x: number, y: number): void;
  public setPosition(position: Point): void;
  public setPosition(_x_position: Point|number, _y?: number): void {
    let x: number;
    let y: number;
    if (typeof _x_position == 'number') {
      x = _x_position;
      y = _y!;
    } else {
      x = _x_position.x;
      y = _x_position.y;
    }
    this.transform.e = 0;
    this.transform.f = 0;
    this.transform.translateSelf(x, y);
  }

  public move(dx: number, dy: number): void;
  public move(delta: Point): void;
  public move(_dx_delta: Point|number, _dy?: number): void {
    let dx: number;
    let dy: number;
    if (typeof _dx_delta == 'number') {
      dx = _dx_delta;
      dy = _dy!;
    } else {
      dx = _dx_delta.x;
      dy = _dx_delta.y;
    }
    this.transform.e += dx;
    this.transform.f += dy;
  }

  public getRotate(): number {
    return this.rotation;
  }

  public setRotate(rotation: number): void {
    this.transform.rotateSelf(-this.rotation);
    this.rotation = rotation;
    this.transform.rotateSelf(rotation);
  }

  public rotateRad(radians: number): void {
    this.rotation += radians;
    this.transform.rotateSelf(radians);
  }

  public rotateDeg(degrees: number): void {
    const radians = degrees * Math.PI / 180;
    this.rotation += radians;
    this.transform.rotateSelf(radians);
  }

  public getZoom(): number {
    return this.zoom;
  }

  public setZoom(zoom: number): void {
    this.transform.scaleSelf(1 / this.zoom, 1 / this.zoom);
    this.zoom = Math.max(Number.EPSILON, zoom);
    this.transform.scaleSelf(this.zoom, this.zoom);
  }

  public zoomBy(factor: number, origin?: Point): void {
    origin && this.transform.translateSelf(origin.x, origin.y);
    this.transform.scaleSelf(factor, factor);
    origin && this.transform.translateSelf(-origin.x, -origin.y);
    this.zoom *= factor;
  }

  public getTransform(): Readonly<DOMMatrix> {
    return this.transform;
  }

  public toWorldSpace(point: Point): Point {
    const t = this.transform.inverse().transformPoint(point);
    return { x: t.x, y: t.y };
  }

  public toScreenSpace(point: Point): Point {
    const t = this.transform.transformPoint(point);
    return { x: t.x, y: t.y };
  }

  public apply(ctx: CanvasRenderingContext2D): void {
    const t = ctx.getTransform().multiplySelf(this.transform);
    ctx.setTransform(t);
  }

}