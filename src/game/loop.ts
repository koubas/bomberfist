import { TileTypes } from "../enums";
import { Event, Events, PlayerEvent } from "./events";
import { Blast, Bomb, WorldState } from "./world";

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

        // apply player events
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
                case event.type === Events.FIRE:
                    placeBomb(world, player.tx, player.ty);
                    break;
                default:
                    throw new Error(`Unknown event: ${event.type}`);
            }
        }
    }

    // player ticks
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

    // bomb ticks
    world.bombs = world.bombs.reduce<Bomb[]>((result, b) => {
        b.countdown--;
        const pow = 4;
        if (b.countdown < 0) {
            world.blasts.push({
                tx: b.tx,
                ty: b.ty,
                powL: pow,
                powR: pow,
                powU: pow,
                powD: pow,
            });
        }
        return [
            ...result,
            ...b.countdown < 0 ? [] : [b],
        ];
    }, []);

    // blast ticks
    if (world.time % 10 == 0) {
        const newBlasts: Blast[] = [];
        world.blasts.forEach(b => {
            if (b.powU > 0 && world.tiles[b.tx][b.ty - 1].type === TileTypes.GROUND) {
                b.powU--;
                newBlasts.push({
                    tx: b.tx,
                    ty: b.ty - 1,
                    powL: 0,
                    powR: 0,
                    powU: b.powU,
                    powD: 0,
                });
            }
            if (b.powR > 0 && world.tiles[b.tx + 1][b.ty].type === TileTypes.GROUND) {
                b.powR--;
                newBlasts.push({
                    tx: b.tx + 1,
                    ty: b.ty,
                    powL: 0,
                    powR: b.powR,
                    powU: 0,
                    powD: 0,
                });
            }
            if (b.powL > 0 && world.tiles[b.tx - 1][b.ty].type === TileTypes.GROUND) {
                b.powL--;
                newBlasts.push({
                    tx: b.tx - 1,
                    ty: b.ty,
                    powL: b.powL,
                    powR: 0,
                    powU: 0,
                    powD: 0,
                });
            }
            if (b.powD > 0 && world.tiles[b.tx][b.ty + 1].type === TileTypes.GROUND) {
                b.powD--;
                newBlasts.push({
                    tx: b.tx,
                    ty: b.ty + 1,
                    powL: 0,
                    powR: 0,
                    powU: 0,
                    powD: b.powD,
                });
            }
            if (b.powD > 0 && b.powL > 0 && b.powR > 0 && b.powU > 0) {
                newBlasts.push(b);
            }
        });
        world.blasts = newBlasts;
    }
}

export function placeBomb(world: WorldState, tx: number, ty: number) {
    if (world.bombs.findIndex(b => (b.tx === tx && b.ty === tx)) > -1) {
        console.log('Bomb already here!');
        return;
    }
    world.bombs.push({
        tx,
        ty,
        countdown: 200,
    });
}

