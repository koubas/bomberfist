import { WorldState } from "./world";

const TICK_RATE = 2;

export function startGameLoop(world: WorldState) {
    return setInterval(() => {
        if (world.updating) {
            console.warn("Skipped a tick");
            return;
        }
        world.updating = true;
        tick(world);
        world.updating = false;
        console.info("tick");
    }, 1000 / TICK_RATE);
}

export function tick(state: WorldState) {

}
