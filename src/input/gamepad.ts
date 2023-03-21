import { Event, Events, PlayerEvent } from "../game/events";

export const controlsActive: Record<number, Record<string, boolean>> = [
    {},
    {},
];

export function gamepadDetect(events: Event[]) {
    window.addEventListener("gamepadconnected", (e) => {
        console.log(
            "Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index,
            e.gamepad.id,
            e.gamepad.buttons.length,
            e.gamepad.axes.length
        );
        poll(events);
    });
}

export function poll(events: Event[]) {
    setInterval(() => {
        const pads = navigator.getGamepads();
        for (let i = 0; i < 2; i++) {
            let pad = pads[i];
            //        console.log(pad?.axes);
            //        console.log(pad?.buttons);

            if (pad?.buttons[0].pressed && !controlsActive[i]["GamepadButton"]) {
                controlsActive[i]["GamepadButton"] = true;
                events.push({
                    type: Events.FIRE,
                    player: i,
                } as PlayerEvent);
            }
            if (!pad?.buttons[0].pressed && controlsActive[i]["GamepadButton"]) {
                controlsActive[i]["GamepadButton"] = false;
            }

            if ((pad?.axes[1] ?? 0) < -0.3 && !controlsActive[i]["up"]) {
                controlsActive[i]["up"] = true;
                events.push({
                    type: Events.PRESS_UP,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[1] ?? 0) >= -0.3 && controlsActive[i]["up"]) {
                controlsActive[i]["up"] = false;
                events.push({
                    type: Events.RELEASE_UP,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[1] ?? 0) > +0.3 && !controlsActive[i]["down"]) {
                controlsActive[i]["down"] = true;
                events.push({
                    type: Events.PRESS_DOWN,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[1] ?? 0) <= +0.3 && controlsActive[i]["down"]) {
                controlsActive[i]["down"] = false;
                events.push({
                    type: Events.RELEASE_DOWN,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[0] ?? 0) < -0.3 && !controlsActive[i]["left"]) {
                controlsActive[i]["left"] = true;
                events.push({
                    type: Events.PRESS_LEFT,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[0] ?? 0) >= -0.3 && controlsActive[i]["left"]) {
                controlsActive[i]["left"] = false;
                events.push({
                    type: Events.RELEASE_LEFT,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[0] ?? 0) > +0.3 && !controlsActive[i]["right"]) {
                controlsActive[i]["right"] = true;
                events.push({
                    type: Events.PRESS_RIGHT,
                    player: i,
                } as PlayerEvent);
            }
            if ((pad?.axes[0] ?? 0) <= +0.3 && controlsActive[i]["right"]) {
                controlsActive[i]["right"] = false;
                events.push({
                    type: Events.RELEASE_RIGHT,
                    player: i,
                } as PlayerEvent);
            }

        }
    }, 5);
}