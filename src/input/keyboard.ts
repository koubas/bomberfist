import { Event, Events, PlayerEvent } from "../game/events";

export const keysDown: string[] = [];

export function bind(events: Event[], callback?: (event: Event) => void) {
  document.addEventListener(
    "keydown",
    (e) => {
      e.preventDefault();
      let prevLen = events.length;
      const code = e.code.toLowerCase();
      if (!keysDown.includes(code)) {
        console.log(`down: ${code}`);
        keysDown.push(code);
        switch (code) {
          // player 1
          case "keyf":
            events.push({
              type: Events.FIRE,
              player: 0,
            } as PlayerEvent);
            break;
          case "keyw":
            events.push({
              type: Events.PRESS_UP,
              player: 0,
            } as PlayerEvent);
            break;
          case "keys":
            events.push({
              type: Events.PRESS_DOWN,
              player: 0,
            } as PlayerEvent);
            break;
          case "keyd":
            events.push({
              type: Events.PRESS_RIGHT,
              player: 0,
            } as PlayerEvent);
            break;
          case "keya":
            events.push({
              type: Events.PRESS_LEFT,
              player: 0,
            } as PlayerEvent);
            break;

          // player 2
          case "enter":
            events.push({
              type: Events.FIRE,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowup":
            events.push({
              type: Events.PRESS_UP,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowdown":
            events.push({
              type: Events.PRESS_DOWN,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowright":
            events.push({
              type: Events.PRESS_RIGHT,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowleft":
            events.push({
              type: Events.PRESS_LEFT,
              player: 1,
            } as PlayerEvent);
            break;
        }
        if (callback && prevLen < events.length) {
          callback(events[events.length - 1]);
        }
      }
    },
    false,
  );

  document.addEventListener(
    "keyup",
    (e) => {
      e.preventDefault();
      let prevLen = events.length;
      const code = e.code.toLowerCase();
      console.log(`up: ${code}`);
      const ki = keysDown.findIndex((k) => k === code);
      if (ki > -1) {
        delete keysDown[ki];
        switch (code) {
          // player 1
          case "keyf":
            break;
          case "keyw":
            events.push({
              type: Events.RELEASE_UP,
              player: 0,
            } as PlayerEvent);
            break;
          case "keys":
            events.push({
              type: Events.RELEASE_DOWN,
              player: 0,
            } as PlayerEvent);
            break;
          case "keyd":
            events.push({
              type: Events.RELEASE_RIGHT,
              player: 0,
            } as PlayerEvent);
            break;
          case "keya":
            events.push({
              type: Events.RELEASE_LEFT,
              player: 0,
            } as PlayerEvent);
            break;

          // player 2
          case "arrowup":
            events.push({
              type: Events.RELEASE_UP,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowdown":
            events.push({
              type: Events.RELEASE_DOWN,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowright":
            events.push({
              type: Events.RELEASE_RIGHT,
              player: 1,
            } as PlayerEvent);
            break;
          case "arrowleft":
            events.push({
              type: Events.RELEASE_LEFT,
              player: 1,
            } as PlayerEvent);
            break;
        }
        if (callback && prevLen < events.length) {
          callback(events[events.length - 1]);
        }
      }
    },
    false,
  );
}
