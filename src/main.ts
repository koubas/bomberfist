import { startGameLoop } from "./game/loop";
import { map } from "./game/map";
import { WorldState, init } from "./game/world";
import { startRendererLoop } from "./renderer/loop";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

if (ctx) { 
    const world: WorldState = init(map);
    startGameLoop(world);
    startRendererLoop(world, ctx);
}
