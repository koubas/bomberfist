import { TileTypes } from "../enums";
import { WorldState } from "../game/world";
import { parseGIF, decompressFrames } from "gifuct-js";
import { createSpriteInstance, _spriteInstances } from "../sprites/sprites";
import { SpriteEnum } from "../sprites/spriteConfigs";
import { SpriteInstance } from "../sprites/SpriteInstance";

const TW = 32;
const TH = 32;

let floorSprite: SpriteInstance;
let player0Sprite: SpriteInstance;
let player1Sprite: SpriteInstance;
let playerDeadSprite: SpriteInstance;
let bombSprite: SpriteInstance;

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
    bombSprite.draw(ctx, bomb.tx * TW, bomb.ty * TH);
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
  renderBombs(world, ctx);
  renderPlayers(world, ctx);
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
  bombSprite = createSpriteInstance(SpriteEnum.BOMB);

  ctx.setTransform(ctx.getTransform().scaleSelf(2, 2));
  window.requestAnimationFrame(() => {
    frame(world, ctx);
  });
}
