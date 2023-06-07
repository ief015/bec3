import GameMain from "~/game/GameMain";
import Body from "~/game/simulation/Body";

export default class Simulation {

  private game: GameMain;
  private bodies: Body[] = [];
  public gravity: number = 1;

  constructor(game: GameMain) {
    this.game = game;
    this.generateBodies(50);
  }

  public getBodies(): Body[] {
    return this.bodies;
  }

  public step(dt: number): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const a = this.bodies[i];
      for (let j = i + 1; j < this.bodies.length; j++) {
        const b = this.bodies[j];
        this.applyNBody(dt, a, b);
      }
    }
    this.bodies.forEach(p => p.step(dt));
  }

  public render(ctx: CanvasRenderingContext2D, dt: number): void {
    this.drawBodies(ctx);
  }

  private applyNBody(dt: number, a: Body, b: Body): void {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const minDist = a.radius + b.radius;
    const distSqr = Math.max(minDist * minDist, dx * dx + dy * dy)
    const dist = Math.sqrt(distSqr);
    const dirx = dx / dist;
    const diry = dy / dist;
    const force = (this.gravity * a.mass * b.mass) / distSqr;
    a.vx += (force / a.mass) * dirx * dt;
    a.vy += (force / a.mass) * diry * dt;
    b.vx -= (force / b.mass) * dirx * dt;
    b.vy -= (force / b.mass) * diry * dt;
  }

  // whack ass shit below
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations#mouse_following_animation

  private drawBodies(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.bodies.forEach(p => p.draw(ctx));
    ctx.restore();
  }

  private generateBodies(amount: number) {
    for (let i = 0; i < amount; i++) {
      const x = window.innerWidth * Math.random();
      const y = window.innerHeight * Math.random();
      const part = new Body(x, y);
      part.strokeColor = this.randomColor();
      part.vx = (Math.random() * 2 - 1) * 10;
      part.vy = (Math.random() * 2 - 1) * 10;
      part.radius = Math.random() * 4 + 1;
      part.mass = part.radius * 1000;
      this.bodies.push(part);
    }
  }

  private randomColor(): string {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
      finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
  }

}
