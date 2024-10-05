import { SpriteConfig } from "./sprites";


export enum SpriteEnum {
  PLAYER_RED,
  PLAYER_BLUE,
  HARD_WALL,
  WALL,
  FLOOR,
  FIREBALL,
  BARREL,
  CORPSE,
  BOMB
}

export const spriteConfigs: SpriteConfig[] = [
  {
    sprite: "bomb1.gif",
    speed: 150,
    loop: true,
  },
  {
    sprite: "fireball1.gif",
    speed: 150,
    loop: false,
  },
  {
    // catch all
    sprite: /.*/,
    speed: 150,
    loop: true,
  },
];
