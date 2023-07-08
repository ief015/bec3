import Body from "~/game/simulation/Body";

/**
 * Generate a three-body solution of a figure-8.
 */
export default function generateFigure8(x: number = 0, y: number = x, scale: number = 1): Body[] {

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
    body1.strokeColor = randomColorStyle();

    body2.x = x;
    body2.y = y;
    body2.vx = -0.93240737 * scale;
    body2.vy = -0.86473146 * scale;
    body2.radius = 0.1 * scale;
    body2.mass = scale ** 3;
    body2.strokeColor = randomColorStyle();

    body3.x = -0.97000436 * scale + x;
    body3.y = 0.24308753 * scale + y;
    body3.vx = 0.4662036850 * scale;
    body3.vy = 0.4323657300 * scale;
    body3.radius = 0.1 * scale;
    body3.mass = scale ** 3;
    body3.strokeColor = randomColorStyle();

    return [ body1, body2, body3 ];
  }