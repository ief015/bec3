import GameMain from "~/game/GameMain";
import Body from "~/game/simulation/Body";

export default class Simulation {

  private game: GameMain;
  private bodies: Body[] = [];
  public gravity: number = 1; // 6.67430e-11;
  public timeScale: number = 1; // higher values decrease accuracy

  constructor(game: GameMain) {
    this.game = game;
  }

  public getBodies(): Body[] {
    return this.bodies;
  }

  public clearBodies(): void {
    this.bodies.splice(0, this.bodies.length);
  }

  public clearBodiesOutsideRect(left: number, top: number, right: number, bottom: number): void {
    for (let i = this.bodies.length - 1; i >= 0; i--) {
      const b = this.bodies[i];
      if (b.x < left || b.x > right || b.y < top || b.y > bottom) {
        this.bodies.splice(i, 1);
      }
    }
  }

  private applyNBody(dt: number, a: Body, b: Body): void {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const minDist = a.radius * a.radius + b.radius * b.radius;
    const distSqr = Math.max(minDist, dx * dx + dy * dy)
    const dist = Math.sqrt(distSqr);
    const dirx = dx / dist;
    const diry = dy / dist;
    const force = this.gravity * a.mass * b.mass / distSqr;
    a.vx += force / a.mass * dirx * dt;
    a.vy += force / a.mass * diry * dt;
    b.vx -= force / b.mass * dirx * dt;
    b.vy -= force / b.mass * diry * dt;
  }

  public step(dt: number): void {
    const dtScaled = dt * this.timeScale;
    for (let i = 0; i < this.bodies.length; i++) {
      const a = this.bodies[i];
      for (let j = i + 1; j < this.bodies.length; j++) {
        const b = this.bodies[j];
        this.applyNBody(dtScaled, a, b);
      }
    }
    for (const b of this.bodies) {
      b.step(dtScaled);
    }
  }

  private drawBodies(ctx: CanvasRenderingContext2D) {
    for (const b of this.bodies) {
      b.draw(ctx);
    }
  }

  public render(ctx: CanvasRenderingContext2D, dt: number): void {
    ctx.save();
    this.drawBodies(ctx);
    ctx.restore();
  }

}
