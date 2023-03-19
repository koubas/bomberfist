import { TileTypes } from "../enums";
import { Event, Events, PlayerEvent } from "./events";
import { WorldState } from "./world";

const TICK_RATE = 80;

export function startGameLoop(world: WorldState, events: Event[]) {
    return setInterval(() => {
        if (world.updating) {
            console.warn("Skipped a tick");
            return;
        }
        world.updating = true;
        tick(world, events);
        world.updating = false;
    }, 1000 / TICK_RATE);
}

export function tick(world: WorldState, events: Event[]) {
    world.time++;

    // consume pending events
    while (world.eventPointer < events.length) {
        const event = events[world.eventPointer];
        world.eventPointer++;
        event.time = world.time;

        console.log(["processing:", event]);

        if ("player" in event) {
            let player = world.players[(event as PlayerEvent).player];
            switch (true) {
                case event.type === Events.PRESS_DOWN:
                    player.walk.y += +1;
                    break;
                case event.type === Events.RELEASE_DOWN:
                    player.walk.y -= +1;
                    break;
                case event.type === Events.PRESS_UP:
                    player.walk.y += -1;
                    break;
                case event.type === Events.RELEASE_UP:
                    player.walk.y -= -1;
                    break;
                case event.type === Events.PRESS_RIGHT:
                    player.walk.x += +1;
                    break;
                case event.type === Events.RELEASE_RIGHT:
                    player.walk.x -= +1;
                    break;
                case event.type === Events.PRESS_LEFT:
                    player.walk.x += -1;
                    break;
                case event.type === Events.RELEASE_LEFT:
                    player.walk.x -= -1;
                    break;
                default:
                    throw new Error(`Unknown event: ${event.type}`);
            }
        }
    }

    world.players.forEach(player => {
        if (player.walk.x !== 0.0 || player.walk.y !== 0.0) {
            // walk
            player.x += player.walk.x;
            player.y += player.walk.y;
            player.tx = Math.round(player.x / 32);
            player.ty = Math.round(player.y / 32);

            // map collisions
            if (world.tiles[player.tx + 1][player.ty].type !== TileTypes.GROUND && player.x > player.tx * 32 ||
                world.tiles[player.tx - 1][player.ty].type !== TileTypes.GROUND && player.x < player.tx * 32) {
                player.x = player.tx * 32;
            }
            if (world.tiles[player.tx][player.ty + 1].type !== TileTypes.GROUND && player.y > player.ty * 32 ||
                world.tiles[player.tx][player.ty - 1].type !== TileTypes.GROUND && player.y < player.ty * 32) {
                player.y = player.ty * 32;
            }
        }
    });
}
