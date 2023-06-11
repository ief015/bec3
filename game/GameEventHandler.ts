import GameMain from "~/game/GameMain";
import Simulation from "~/game/simulation/Simulation";

export default class GameEventHandler {

  private game: GameMain;

  constructor(game: GameMain) {
    this.game = game;
  }

  public getGame(): GameMain {
    return this.game;
  }

  public getSimulation(): Simulation {
    return this.game.getSimulation();
  }

  /**
   * Canvas has resized.
   */
  public onResize(width: number, height: number) {

  }

  /**
   * Update before simulation.
   */
  public onPreUpdate(dt: number) {

  }

  /**
   * Update after simulation.
   */
  public onPostUpdate(dt: number) {

  }

  /**
   * Draw under simulation.
   */
  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }

  /**
   * Draw over simulation.
   */
  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {

  }


  /**
   * Mouse/touch pressed.
   */
  public onPressDown(x: number, y: number, button: number) {

  };

  /**
   * Mouse/touch released.
   */
  public onPressUp(x: number, y: number, button: number) {

  };

}