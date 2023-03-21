import { TileTypes } from "../enums";
import * as random from "random-seed";

interface PlayerState {
    walk: { x: number; y: number; };
    x: number;
    y: number;
    tx: number;
    ty: number;
}

export interface TileState {
    type: TileTypes;
}

export interface Bomb {
    tx: number;
    ty: number;
}

export interface WorldState {
    time: number;
    eventPointer: number;
    updating: boolean,
    players: PlayerState[],
    mapW: number;
    mapH: number;
    tiles: TileState[][];
    bombs: Bomb[];
}

function initTiles(map: number[][]): TileState[][] {
    // initialize from simplified map
    const tiles: TileState[][] = [];
    for (let x = 0; x < map[0].length; x++) {
        tiles[x] = [];
        for (let y = 0; y < map.length; y++) {
            tiles[x][y] = {
                type: map[y][x],
            }
        }

    }

    // place random walls
    const wallRand = random.create("wall-seed-42");
    for (let x = 0; x < map[0].length; x++) {
        for (let y = 0; y < map.length; y++) {
            if (wallRand.intBetween(0, 4) && tiles[x][y].type === TileTypes.GROUND) {
                tiles[x][y].type = TileTypes.WALL;
            }
        }

    }

    // make room for first steps
    tiles[1][1].type = TileTypes.GROUND;
    tiles[2][1].type = TileTypes.GROUND;
    tiles[3][1].type = TileTypes.GROUND;
    tiles[1][2].type = TileTypes.GROUND;
    tiles[1][3].type = TileTypes.GROUND;

    tiles[13][13].type = TileTypes.GROUND;
    tiles[12][13].type = TileTypes.GROUND;
    tiles[11][13].type = TileTypes.GROUND;
    tiles[13][12].type = TileTypes.GROUND;
    tiles[13][11].type = TileTypes.GROUND;

    return tiles;
}

export function init(map: number[][]): WorldState {
    const tiles = initTiles(map);
    return {
        time: 0,
        eventPointer: 0,
        players: [
            {
                tx: 1,
                ty: 1,
                x: 32.0,
                y: 32.0,
                walk: { x: 0.0, y: 0.0 },
            },
            {
                tx: 13,
                ty: 13,
                x: 13 * 32.0,
                y: 13 * 32.0,
                walk: { x: 0.0, y: 0.0 },
            }
        ],
        mapW: tiles.length,
        mapH: tiles[0].length,
        tiles,
        bombs: [],
        updating: false,
    };
}