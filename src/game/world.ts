import { TileTypes } from "../enums";

interface PlayerState {
    x: number;
    y: number;
    tx: number;
    ty: number;
}

export interface TileState {
    type: TileTypes;    
}

export interface WorldState {
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
        players: [
            {
                tx: 1,
                ty: 1,
                x: 0,
                y: 0,
            }
        ],
        mapW: tiles.length,
        mapH: tiles[0].length,
        tiles,
        updating: false,
    };
}