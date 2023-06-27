import Camera from "~/game/Camera";
import GameMain from "~/game/GameMain";
import Point from "~/game/Point";
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

  public getCamera(): Camera {
    return this.game.getCamera();
  }

  public getCursor(): Readonly<Point> {
    return this.game.getCursor();
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

  /**
   * Key pressed.
   */
  public onKeyDown(key: string) {

  }

  /**
   * Key released.
   */
  public onKeyUp(key: string) {

  }

  /**
   * Cursor moved.
   */
  public onCursorMove(x: number, y: number, dx: number, dy: number) {

  }

  /**
   * Wheel moved.
   */
  public onWheel(dx: number, dy: number, dz: number) {

  }

}