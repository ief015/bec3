import GameMain from "~/game/GameMain";
import Body from "~/game/simulation/Body";

export default class Simulation {

  private game: GameMain;
  private bodies: Body[] = [];
  public gravity: number = 1; // 6.67430e-11;
  public timeScale: number = 1; // higher values decrease accuracy

  constructor(game: GameMain) {
    this.game = game;
    this.generateFigure8(window.innerWidth / 2, window.innerHeight / 2, 100);
  }

  public getBodies(): Body[] {
    return this.bodies;
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

  public render(ctx: CanvasRenderingContext2D, dt: number): void {
    ctx.save();
    this.drawBodies(ctx);
    ctx.restore();
  }

  private applyNBody(dt: number, a: Body, b: Body): void {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const minDist = a.radius * a.radius + b.radius * b.radius;
    const distSqr = Math.max(minDist, dx * dx + dy * dy)
    const dist = Math.sqrt(distSqr);
    const dirx = dx / dist;
    const diry = dy / dist;
    const force = (this.gravity * a.mass * b.mass) / distSqr;
    a.vx += (force / a.mass) * dirx * dt;
    a.vy += (force / a.mass) * diry * dt;
    b.vx -= (force / b.mass) * dirx * dt;
    b.vy -= (force / b.mass) * diry * dt;
  }


  private drawBodies(ctx: CanvasRenderingContext2D) {
    for (const b of this.bodies) {
      b.draw(ctx);
    }
  }

  private generateFigure8(x: number, y: number, scale: number = 1) {

    // https://www.researchgate.net/publication/369759901_The_remarkable_figure-8_solution_of_the_three-body_problem

    const body1 = new Body();
    const body2 = new Body();
    const body3 = new Body();

    body1.x = 0.97000436 * scale + x;
    body1.y = -0.24308753 * scale + y;
    body1.vx = 0.4662036850 * scale;
    body1.vy = 0.4323657300 * scale;
    body1.radius = 0.1 * scale;
    body1.mass = scale ** 3;
    body1.strokeColor = this.randomColor();

    body2.x = x;
    body2.y = y;
    body2.vx = -0.93240737 * scale;
    body2.vy = -0.86473146 * scale;
    body2.radius = 0.1 * scale;
    body2.mass = scale ** 3;
    body2.strokeColor = this.randomColor();

    body3.x = -0.97000436 * scale + x;
    body3.y = 0.24308753 * scale + y;
    body3.vx = 0.4662036850 * scale;
    body3.vy = 0.4323657300 * scale;
    body3.radius = 0.1 * scale;
    body3.mass = scale ** 3;
    body3.strokeColor = this.randomColor();

    this.bodies.push(body1, body2, body3);
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
