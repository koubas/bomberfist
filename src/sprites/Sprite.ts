import { decompressFrames, parseGIF } from "gifuct-js";
import { SpriteConfig } from "./sprites";

const DEFAULT_WIDTH = 32;
const DEFAULT_HEIGHT = 32;

let nextSid = 0;

export class Sprite {
  private path: string;
  private frames: HTMLCanvasElement[] = [];

  public readonly sid: number;
  public readonly config;
  public frameCount: number = 0;

  constructor(path: string, config: SpriteConfig, explicitSID?: number) {
    this.path = path;
    this.config = config;
    if (explicitSID === undefined) {
      this.sid = nextSid++;
    } else {
      if (explicitSID < nextSid) {
        throw new Error(`Can't set explicitDID (${explicitSID}) lower then nextSid (${nextSid})`);
      }

      this.sid = explicitSID;

      if (explicitSID >= nextSid) {
        nextSid = explicitSID + 1;
      }
    }
  }

  async load() {
    if (this.frames.length > 0) {
      throw new Error(`Sprite sid ${this.sid} is already loaded`);
    }

    const gifResponse = await fetch(this.path);
    const gifData = parseGIF(await gifResponse.arrayBuffer());
    const gifFrames = decompressFrames(gifData, true);
    this.frameCount = gifFrames.length;

    for (const frame of gifFrames) {
      const { width, height } = frame.dims;

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = width;
      frameCanvas.height = height;

      const frameCtx = frameCanvas.getContext("2d")!;

      const imageData = frameCtx.createImageData(width, height);
      imageData.data.set(frame.patch);

      frameCtx.putImageData(imageData, 0, 0);

      this.frames.push(frameCanvas);
    }
  }

  drawFrame(ctx: CanvasRenderingContext2D, frame: number, x: number, y: number, w: number = DEFAULT_WIDTH, h: number = DEFAULT_HEIGHT) {
    ctx.drawImage(this.frames[frame % this.frameCount], x, y, w, h);
  }
}
