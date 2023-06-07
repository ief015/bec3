import Point from "~/game/Point";

export default class Body {

  public x: number = 0;
  public y: number = 0;
  public lx: number = 0;
  public ly: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  public radius: number = 1;
  public mass: number = 1;
  public strokeColor: string = 'white';

  constructor(
    x: number = 0,
    y: number = 0,
  ) {
    this.x = x;
    this.y = y;
    this.lx = x;
    this.ly = y;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = this.radius * 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.strokeColor;
    ctx.moveTo(this.lx, this.ly);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }

  public step(dt: number) {
    this.lx = this.x;
    this.ly = this.y;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

}