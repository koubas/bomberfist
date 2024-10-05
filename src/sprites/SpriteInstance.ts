import { Sprite } from "./Sprite";

export class SpriteInstance {
  private sprite: Sprite;
  private frame = 0;
  private animationFinished = false;
  public garbageCollect = false;
  public particle: null | {
    x: number;
    y: number;
  } = null;

  constructor(sprite: Sprite) {
    this.sprite = sprite;
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    if (!this.garbageCollect) {
      this.sprite.drawFrame(ctx, this.frame, x, y);
    }
  }

  tick() {
    if (!this.animationFinished) {
      this.frame++;
      if (!this.sprite.config.loop && this.frame >= this.sprite.frameCount) {
        this.animationFinished = true;
      }
    }
    if (this.animationFinished && !this.sprite.config.loop) {
      this.garbageCollect = true;
    }
  }
}
