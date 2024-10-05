import { debug } from "console";
import { Event, Events, PlayerEvent } from "../game/events";

export const controlsActive: Record<number, Record<string, boolean>> = [{}, {}];

export function gamepadDetect(events: Event[]) {
  window.addEventListener("gamepadconnected", (e) => {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
    poll(events);
  });
}

export function poll(events: Event[]) {
  setInterval(() => {
    const pads = navigator.getGamepads();
    for (let g = 0; g < 5; g++) {
      let pad = pads[g];
      if (!pad) {
        // no pad at this index
        break;
      }

      let pid = 0;
      if (g === 0) {
        pid = 0;
      } else if (g === 1) {
        pid = 1;
      }

      //console.log([i, pad?.axes]);
      // console.log(pad?.buttons);

      if (pad?.buttons[0].pressed && !controlsActive[g]["GamepadButton"]) {
        controlsActive[g]["GamepadButton"] = true;
        events.push({
          type: Events.FIRE,
          player: pid,
        } as PlayerEvent);
      }
      if (!pad?.buttons[0].pressed && controlsActive[g]["GamepadButton"]) {
        controlsActive[g]["GamepadButton"] = false;
      }

      if ((pad?.axes[1] ?? 0) < -0.3 && !controlsActive[g]["up"]) {
        controlsActive[g]["up"] = true;
        events.push({
          type: Events.PRESS_UP,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[1] ?? 0) >= -0.3 && controlsActive[g]["up"]) {
        controlsActive[g]["up"] = false;
        events.push({
          type: Events.RELEASE_UP,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[1] ?? 0) > +0.3 && !controlsActive[g]["down"]) {
        controlsActive[g]["down"] = true;
        events.push({
          type: Events.PRESS_DOWN,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[1] ?? 0) <= +0.3 && controlsActive[g]["down"]) {
        controlsActive[g]["down"] = false;
        events.push({
          type: Events.RELEASE_DOWN,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[0] ?? 0) < -0.3 && !controlsActive[g]["left"]) {
        controlsActive[g]["left"] = true;
        events.push({
          type: Events.PRESS_LEFT,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[0] ?? 0) >= -0.3 && controlsActive[g]["left"]) {
        controlsActive[g]["left"] = false;
        events.push({
          type: Events.RELEASE_LEFT,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[0] ?? 0) > +0.3 && !controlsActive[g]["right"]) {
        controlsActive[g]["right"] = true;
        events.push({
          type: Events.PRESS_RIGHT,
          player: pid,
        } as PlayerEvent);
      }
      if ((pad?.axes[0] ?? 0) <= +0.3 && controlsActive[g]["right"]) {
        controlsActive[g]["right"] = false;
        events.push({
          type: Events.RELEASE_RIGHT,
          player: pid,
        } as PlayerEvent);
      }
    }
  }, 5);
}
