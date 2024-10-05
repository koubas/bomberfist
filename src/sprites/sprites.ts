import { Sprite } from "./Sprite";
import { spriteConfigs, SpriteEnum } from "./spriteConfigs";
import { SpriteInstance } from "./SpriteInstance";

const SPRITES_ROOT = "../sprites";

export type SpriteConfig = {
  sprite: string | RegExp;
  speed: number;
  loop?: boolean;
};

export type SpriteSheet = Map<number | SpriteEnum, Sprite>;

let _spriteSheet: SpriteSheet;
export let _spriteInstances: SpriteInstance[] = [];

function matchConfig(path: string) {
  const config = spriteConfigs.find((c) => {
    if (c.sprite instanceof RegExp) {
      return c.sprite.test(path);
    } else {
      return c.sprite === path;
    }
  });
  if (!config) {
    throw new Error(`No config matched for ${path}`);
  }
  return config;
}

async function loadSprite(path: string, staticSprite?: SpriteEnum) {
  const config = matchConfig(path);
  const sprite = new Sprite(`${SPRITES_ROOT}/${path}`, config, staticSprite);
  await sprite.load();
  console.log(`Loaded SID ${sprite.sid}: ${path}`);
  return sprite;
}

async function loadStaticSpriteEntry(staticSprite: SpriteEnum, path: string): Promise<[SpriteEnum, Sprite]> {
  return [staticSprite, await loadSprite(path, staticSprite)];
}

export async function preloadSprites() {
  const L = loadStaticSpriteEntry;
  const loadingEntries = [
    L(SpriteEnum.PLAYER_RED, "player1.gif"),
    L(SpriteEnum.PLAYER_BLUE, "player2.gif"),
    L(SpriteEnum.HARD_WALL, "rock2.gif"),
    L(SpriteEnum.WALL, "bush1.gif"),
    L(SpriteEnum.FLOOR, "grass1.gif"),
    L(SpriteEnum.FIREBALL, "fireball1.gif"),
    L(SpriteEnum.BARREL, "red_barrel.gif"),
    L(SpriteEnum.CORPSE, "corpse.gif"),
  ];
  _spriteSheet = new Map(await Promise.all(loadingEntries));
}

export function createSpriteInstance(sid: number | SpriteEnum) {
  const sprite = _spriteSheet?.get(sid);
  if (!sprite) {
    throw new Error(`Sprite with SID ${sid} not found `);
  }
  const instance = new SpriteInstance(sprite);
  _spriteInstances.push(instance);
  return instance;
}

export function emitParticle(sid: number | SpriteEnum, x: number, y: number) {
  createSpriteInstance(sid).particle = { x, y };
}

export function spriteInstancesTick(time: number) {
  _spriteInstances.forEach((s, i) => {
    if (time % 10 === 0) {
      s.tick();
    }
    if (s.garbageCollect) {
      _spriteInstances.splice(i, 1);
    }
  });
}
