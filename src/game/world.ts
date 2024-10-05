import { TileTypes } from "../enums";
import * as random from "random-seed";
import { SpriteInstance } from "../sprites/SpriteInstance";
import { createSpriteInstance, SpriteSheet } from "../sprites/sprites";
import { SpriteEnum } from "../sprites/spriteConfigs";

type PlayerState = {
  alive: boolean;
  walk: { x: number; y: number };
  x: number;
  y: number;
  tx: number;
  ty: number;
};

export type TileState = {
  type: TileTypes;
  sprite?: SpriteInstance;
};

export type Bomb = {
  tx: number;
  ty: number;
  countdown: number;
};

export type Blast = {
  tx: number;
  ty: number;
  powL: number;
  powR: number;
  powU: number;
  powD: number;
  expanded: boolean;
};

export type WorldState = {
  time: number;
  eventPointer: number;
  updating: boolean;
  players: PlayerState[];
  mapW: number;
  mapH: number;
  tiles: TileState[][];
  bombs: Bomb[];
  blasts: Blast[];
};

function initTiles(map: number[][]): TileState[][] {
  // initialize from simplified map
  const tiles: TileState[][] = [];
  for (let x = 0; x < map[0].length; x++) {
    tiles[x] = [];
    for (let y = 0; y < map.length; y++) {
      const type = map[y][x];
      tiles[x][y] = {
        type,
        sprite:
          type === TileTypes.HARD_WALL
            ? createSpriteInstance(SpriteEnum.HARD_WALL)
            : type === TileTypes.WALL
              ? createSpriteInstance(SpriteEnum.WALL)
              : undefined,
      };
    }
  }

  // place random walls
  const wallRand = random.create("wall-seed-42");
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const tile = tiles[y][x];
      if (wallRand.intBetween(0, 5) && tile.type === TileTypes.GROUND) {
        tile.type = TileTypes.WALL;
        tile.sprite = createSpriteInstance(SpriteEnum.WALL);
      }
    }
  }

  // make room for first steps
  const cleaner: TileState = { type: TileTypes.GROUND, sprite: undefined };
  tiles[1][1] = cleaner;
  tiles[2][1] = cleaner;
  tiles[3][1] = cleaner;
  tiles[1][2] = cleaner;
  tiles[1][3] = cleaner;

  tiles[13][13] = cleaner;
  tiles[12][13] = cleaner;
  tiles[11][13] = cleaner;
  tiles[13][12] = cleaner;
  tiles[13][11] = cleaner;

  return tiles;
}

export function init(map: number[][]): WorldState {
  const tiles = initTiles(map);
  return {
    time: 0,
    eventPointer: 0,
    players: [
      {
        alive: true,
        tx: 1,
        ty: 1,
        x: 32.0,
        y: 32.0,
        walk: { x: 0.0, y: 0.0 },
      },
      {
        alive: true,
        tx: 13,
        ty: 13,
        x: 13 * 32.0,
        y: 13 * 32.0,
        walk: { x: 0.0, y: 0.0 },
      },
    ],
    mapW: tiles.length,
    mapH: tiles[0].length,
    tiles,
    bombs: [],
    blasts: [],
    updating: false,
  };
}
