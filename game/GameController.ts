import GameEventHandler from "~/game/GameEventHandler";
import Body from "~/game/simulation/Body";
import randomColorHex from "~/game/simulation/utils/randomColor";

export default class GameController extends GameEventHandler {

  public onPreUpdate(dt: number) {

  }

  public onPostUpdate(dt: number) {

  }

  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  public onPressDown(x: number, y: number) {

  };

  public onPressUp(x: number, y: number) {
    const sim = this.getSimulation();
    const body = new Body(x, y);
    body.radius = 2;
    body.mass = 1;
    body.vx = 0;
    body.vy = 0;
    body.strokeColor = randomColorHex();
    sim.getBodies().push(body);
  };

}