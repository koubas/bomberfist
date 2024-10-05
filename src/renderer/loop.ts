import { TileTypes } from "../enums";
import { WorldState } from "../game/world";
import { parseGIF, decompressFrames } from "gifuct-js";
import { createSpriteInstance, _spriteInstances } from "../sprites/sprites";
import { SpriteEnum } from "../sprites/spriteConfigs";
import { SpriteInstance } from "../sprites/SpriteInstance";

const TW = 32;
const TH = 32;

let cachedFrames = new Map<string, HTMLCanvasElement[]>();

let floorSprite: SpriteInstance;
let player0Sprite: SpriteInstance;
let player1Sprite: SpriteInstance;
let playerDeadSprite: SpriteInstance;

async function loadAllFrames(path: string) {
  let cache = cachedFrames.get(path);
  if (cache) {
    return cache;
  }

  const gifResponse = await fetch(path);
  const gifData = parseGIF(await gifResponse.arrayBuffer());
  const gifFrames = decompressFrames(gifData, true);

  let frames: HTMLCanvasElement[] = [];
  for (const frame of gifFrames) {
    const { width, height } = frame.dims;

    // Create a new canvas for each frame
    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = width;
    frameCanvas.height = height;

    const frameCtx = frameCanvas.getContext("2d")!;

    // Create ImageData and set pixel data
    const imageData = frameCtx.createImageData(width, height);
    imageData.data.set(frame.patch);

    // Draw the image data onto the frame's canvas
    frameCtx.putImageData(imageData, 0, 0);

    frames.push(frameCanvas);
  }

  cachedFrames.set(path, frames);

  return frames;
}

function renderBackground(world: WorldState, ctx: CanvasRenderingContext2D) {
  for (let y = 0; y < world.mapH; y++) {
    for (let x = 0; x < world.mapW; x++) {
      floorSprite.draw(ctx, x * TW, y * TH);
    }
  }
}

function renderTiles(world: WorldState, ctx: CanvasRenderingContext2D) {
  for (let y = 0; y < world.mapH; y++) {
    for (let x = 0; x < world.mapW; x++) {
      const tile = world.tiles[x][y];
      if (tile.sprite) {
        tile.sprite.draw(ctx, x * TW, y * TH);
      }
    }
  }
}

function renderPlayers(world: WorldState, ctx: CanvasRenderingContext2D) {
  world.players.forEach(async (player, idx) => {
    let sprite: string;
    switch (true) {
      case !player.alive:
        playerDeadSprite.draw(ctx, player.x, player.y);
        break;
      case idx === 0:
        player0Sprite.draw(ctx, player.x, player.y);
        break;
      case idx > 0:
        player1Sprite.draw(ctx, player.x, player.y);
        break;
      default:
        throw new Error("Invalid branch");
    }
  });
}

function renderBombs(world: WorldState, ctx: CanvasRenderingContext2D) {
  world.bombs.forEach((bomb) => {
    ctx.beginPath();
    ctx.fillStyle = "Black";
    ctx.arc(bomb.tx * TW + TW / 2, bomb.ty * TW + TW / 2, TW * 0.4, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function renderBlasts(world: WorldState, ctx: CanvasRenderingContext2D) {
  world.blasts.forEach((blast) => {
    //blast.sprite.draw(ctx, blast.tx * TW, blast.ty * TH);
    ctx.beginPath();
    ctx.fillStyle = "Red";
    ctx.arc(blast.tx * TW + TW / 2, blast.ty * TW + TW / 2, TW * 0.5, 0, 2 * Math.PI);
    //    ctx.fill();
  });
}

function renderParticles(ctx: CanvasRenderingContext2D) {
  for (const p of _spriteInstances) {
    if (p.particle && !p.garbageCollect) {
      p.draw(ctx, p.particle.x * TW, p.particle.y * TH);
    }
  }
}

async function frame(world: WorldState, ctx: CanvasRenderingContext2D) {
  const startTime = Date.now();
  renderBackground(world, ctx);
  renderTiles(world, ctx);
  renderPlayers(world, ctx);
  renderBombs(world, ctx);
  renderBlasts(world, ctx);
  renderParticles(ctx);
  const duration = Date.now() - startTime;

  if (Math.random() > 0.95) {
    console.log(`frame duration: ${duration}ms`);
  }

  window.requestAnimationFrame(async () => {
    await frame(world, ctx);
  });
}

export function startRendererLoop(world: WorldState, ctx: CanvasRenderingContext2D) {
  floorSprite = createSpriteInstance(SpriteEnum.FLOOR);
  player0Sprite = createSpriteInstance(SpriteEnum.PLAYER_RED);
  player1Sprite = createSpriteInstance(SpriteEnum.PLAYER_BLUE);
  playerDeadSprite = createSpriteInstance(SpriteEnum.CORPSE);

  ctx.setTransform(ctx.getTransform().scaleSelf(2, 2));
  window.requestAnimationFrame(() => {
    frame(world, ctx);
  });
}
