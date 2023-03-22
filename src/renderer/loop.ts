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
                    ctx.fillStyle =  "orange";
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
    world.players.forEach((player, idx) => {
        ctx.beginPath();
        ctx.strokeStyle = "LightGray";
        ctx.strokeRect(player.tx *TW, player.ty*TH, TW, TH);
        ctx.fillStyle = idx === 0 ? "green" : "blue";
        ctx.arc(player.x + (TW/2), player.y + (TW/2), TW/2, 0, 2*Math.PI);
        ctx.fill();
    });
}

function renderBombs(world: WorldState, ctx: CanvasRenderingContext2D) {
    world.bombs.forEach((bomb) => {
        ctx.beginPath();
        ctx.fillStyle = "Black"
        ctx.arc(bomb.tx*TW + (TW/2), bomb.ty*TW + (TW/2), TW*0.4, 0, 2*Math.PI);
        ctx.fill();
    });
}

function renderBlasts(world: WorldState, ctx: CanvasRenderingContext2D) {
    world.blasts.forEach((blast) => {
        ctx.beginPath();
        ctx.fillStyle = "Red"
        ctx.arc(blast.tx*TW + (TW/2), blast.ty*TW + (TW/2), TW*0.5, 0, 2*Math.PI);
        ctx.fill();
    });
}

function frame(world: WorldState, ctx: CanvasRenderingContext2D) {
    renderTiles(world, ctx);    
    renderPlayers(world, ctx);   
    renderBombs(world, ctx);
    renderBlasts(world, ctx);

    window.requestAnimationFrame(() => {
        frame(world, ctx);
    });
}

export function startRendererLoop(world: WorldState, ctx: CanvasRenderingContext2D) {
    ctx.setTransform(ctx.getTransform().scaleSelf(2,2));
    window.requestAnimationFrame(() => {
        frame(world, ctx);
    });
}
