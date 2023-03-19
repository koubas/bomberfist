import { TileTypes } from "../enums";
import { WorldState } from "../game/world";

const TW = 32;
const TH = 32;

function renderTiles(world: WorldState, ctx: CanvasRenderingContext2D) {
    for (let y = 0; y < world.mapH; y++) {
        for (let x = 0; x < world.mapW; x++) {
            const tile = world.tiles[x][y];
            switch(tile.type) {
                case TileTypes.GROUND:
                    ctx.fillStyle =  "white";
                    break;
                case TileTypes.WALL:
                    ctx.fillStyle =  "red";
                    break;
                case TileTypes.HARD_WALL:
                    ctx.fillStyle =  "gray";
                    break;
                default:
                    throw new Error(`Bad tile type: ${tile.type}`);
            }
            
            ctx.fillRect(x*TW, y*TH, TW, TH);
        }
    }
}

function renderPlayers(world: WorldState, ctx: CanvasRenderingContext2D) {
    world.players.forEach(player => {
        ctx.fillStyle =  "green";
        ctx.arc(player.tx*TW + (TW/2), player.ty*TW + (TW/2), TW/2, 0, 2*Math.PI);
        ctx.fill();
    });
}

function frame(world: WorldState, ctx: CanvasRenderingContext2D) {
    renderTiles(world, ctx);    
    renderPlayers(world, ctx);    
    window.requestAnimationFrame(() => {
        frame(world, ctx);
    });
}

export function startRendererLoop(world: WorldState, ctx: CanvasRenderingContext2D) {
    window.requestAnimationFrame(() => {
        frame(world, ctx);
    });
}
