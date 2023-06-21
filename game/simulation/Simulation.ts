import GameMain from "~/game/GameMain";
import Point from "~/game/Point";
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

  public pushBodies(...bodies: Body[]): void {
    this.bodies.push(...bodies);
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
    const force = this.gravity * a.mass * b.mass / distSqr;
    const forceX = dx / dist * force * dt;
    const forceY = dy / dist * force * dt;
    a.vx += forceX / a.mass;
    a.vy += forceY / a.mass;
    b.vx -= forceX / b.mass;
    b.vy -= forceY / b.mass;
  }

  /**
   * Trace the path of `traceBody` without applying forces on the simulation. Mutates `traceBody`.
   * @param traceBody A body to trace. This should be a new Body instance detached from the simulation.
   * @param iterations Path length in number of iterations. Higher = expensive. Default is `50`.
   * @param interval Time in seconds between iterations. Longer = inaccuracy. Default is `1/25`.
   * @returns An array of points representing the path after each iteration.
   */
  public tracePath(traceBody: Body, iterations: number = 50, interval: number = 1/25): Point[] {
    const a = traceBody;
    const path: Point[] = [];
    for (let i = 0; i < iterations; i++) {
      for (const otherBody of this.bodies) {
        const b = otherBody;
        if (a === b)
          continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDist = a.radius * a.radius + b.radius * b.radius;
        const distSqr = Math.max(minDist, dx * dx + dy * dy)
        const dist = Math.sqrt(distSqr);
        const force = this.gravity * a.mass * b.mass / distSqr;
        const forceX = dx / dist * force * interval;
        const forceY = dy / dist * force * interval;
        a.vx += forceX / a.mass;
        a.vy += forceY / a.mass;
      }
      a.step(interval);
      path.push({ x: a.x, y: a.y });
    }
    return path;
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
