import GameEventHandler from "~/game/GameEventHandler";

export default class GameEventManager extends GameEventHandler {

  private handlers: GameEventHandler[] = [];

  public addHandler(handler: GameEventHandler) {
    this.handlers.push(handler);
  }

  public removeHandler(handler: GameEventHandler) {
    const index = this.handlers.indexOf(handler);
    if (index >= 0) {
      this.handlers.splice(index, 1);
    } else {
      throw new Error('Handler not found');
    }
  }

  /**
   * Canvas has resized.
   */
  public onResize(width: number, height: number) {
    for (const handler of this.handlers) {
      handler.onResize(width, height);
    }
  }

  /**
   * Update before simulation.
   */
  public onPreUpdate(dt: number) {
    for (const handler of this.handlers) {
      handler.onPreUpdate(dt);
    }
  }

  /**
   * Update after simulation.
   */
  public onPostUpdate(dt: number) {
    for (const handler of this.handlers) {
      handler.onPostUpdate(dt);
    }
  }

  /**
   * Draw under simulation.
   */
  public onPreDraw(ctx: CanvasRenderingContext2D, dt: number) {
    for (const handler of this.handlers) {
      handler.onPreDraw(ctx, dt);
    }
  }

  /**
   * Draw over simulation.
   */
  public onPostDraw(ctx: CanvasRenderingContext2D, dt: number) {
    for (const handler of this.handlers) {
      handler.onPostDraw(ctx, dt);
    }
  }


  /**
   * Mouse/touch pressed.
   */
  public onPressDown(x: number, y: number, button: number) {
    for (const handler of this.handlers) {
      handler.onPressDown(x, y, button);
    }
  };

  /**
   * Mouse/touch released.
   */
  public onPressUp(x: number, y: number, button: number) {
    for (const handler of this.handlers) {
      handler.onPressUp(x, y, button);
    }
  };

  /**
   * Key pressed.
   */
  public onKeyDown(key: string) {
    for (const handler of this.handlers) {
      handler.onKeyDown(key);
    }
  }

  /**
   * Key released.
   */
  public onKeyUp(key: string) {
    for (const handler of this.handlers) {
      handler.onKeyUp(key);
    }
  }

  /**
   * Cursor moved.
   */
  public onCursorMove(x: number, y: number, dx: number, dy: number) {
    for (const handler of this.handlers) {
      handler.onCursorMove(x, y, dx, dy);
    }
  }

  /**
   * Wheel moved.
   */
  public onWheel(dx: number, dy: number, dz: number) {
    for (const handler of this.handlers) {
      handler.onWheel(dx, dy, dz);
    }
  }

}