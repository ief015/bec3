export default class Body {

  public name: string = generateName();
  public x: number = 0;
  public y: number = 0;
  public lx: number = 0;
  public ly: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  public radius: number = 1;
  public mass: number = 1;
  public strokeColor: string = 'white';

  constructor ();
  constructor (copy: Body);
  constructor (x: number, y: number, vx?: number, vy?: number, radius?: number, mass?: number, strokeColor?: string);
  constructor(x?: Body|number, y?: number, vx?: number, vy?: number, radius?: number, mass?: number, strokeColor?: string) {
    if (x instanceof Body) {
      this.x = x.x;
      this.y = x.y;
      this.lx = x.lx;
      this.ly = x.ly;
      this.vx = x.vx;
      this.vy = x.vy;
      this.radius = x.radius;
      this.mass = x.mass;
      this.strokeColor = x.strokeColor;
      this.name = x.name;
    }
    else if (typeof x == 'number') {
      this.x = x;
      this.y = y!;
      this.lx = x;
      this.ly = y!;
      vx && (this.vx = vx);
      vy && (this.vy = vy);
      radius && (this.radius = radius);
      mass && (this.mass = mass);
      strokeColor && (this.strokeColor = strokeColor);
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    if (this.radius <= 0)
      return;
    ctx.beginPath();
    ctx.lineWidth = this.radius * 2;
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

  /**
   * Get the speed of the body.
   */
  public getSpeed(): number {
    return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }

  /**
   * Get the direction of the body in radians.
   */
  public getDirection(): number {
    return Math.atan2(this.vy, this.vx);
  }

  /**
   * Get the direction of the body in degrees.
   */
  public getDirectionDegrees(): number {
    return this.getDirection() * 180 / Math.PI;
  }

}