import { TileTypes } from "../enums";

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

export interface WorldState {
    time: number;
    eventPointer: number;
    updating: boolean,
    players: PlayerState[],
    mapW: number;
    mapH: number;
    tiles: TileState[][];
}

function initTiles(map: number[][]): TileState[][] {
    const tiles: TileState[][] = [];
    for (let x = 0; x < map[0].length; x++) {
        tiles[x] = [];
        for (let y = 0; y < map.length; y++) {
            tiles[x][y] = {
                type: map[y][x],
            }
        }
    }
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
                x: 13*32.0,
                y: 13*32.0,
                walk: { x: 0.0, y: 0.0 },
            }
        ],
        mapW: tiles.length,
        mapH: tiles[0].length,
        tiles,
        updating: false,
    };
}