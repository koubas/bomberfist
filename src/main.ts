import { Events, Event, PlayerEvent } from "./game/events";
import { startGameLoop } from "./game/loop";
import { map } from "./game/map";
import { WorldState, init } from "./game/world";
import { startRendererLoop } from "./renderer/loop";
import * as keyboard from "./input/keyboard";
import * as gamepad from "./input/gamepad";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas?.getContext("2d");

if (ctx) {
    const events: Event[] = [];
    const world: WorldState = init(map);
    
    startGameLoop(world, events);
    startRendererLoop(world, ctx);

    keyboard.bind(events);
    gamepad.gamepadDetect(events);
}
