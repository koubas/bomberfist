import { Event } from "./game/events";
import { startGameLoop } from "./game/loop";
import { map } from "./game/map";
import { init, WorldState } from "./game/world";
import { startRendererLoop } from "./renderer/loop";
import { Server, WebSocket } from "ws";

const WS_PORT = 9000;

async function receiveMessage<T>(ws: WebSocket) {
  return new Promise<T>((resolve, reject) => {
    ws.once("message", (message) => {
      ws.removeAllListeners();
      resolve(JSON.parse(message.toString()) as T);
    });

    ws.once("error", (err) => {
      ws.removeAllListeners();
      reject(err);
    });
  });
}

async function playersConnected(wss: Server) {
  const conns: WebSocket[] = [];
  return new Promise<typeof conns>(async (resolve) => {
    wss.on("connection", async (ws, req) => {
      console.log(`New connection from ${req.socket.remoteAddress}`);
      const hi = await receiveMessage<any>(ws);
      if (typeof hi !== "object" || hi.me == null) {
        console.log("go away weirdo [closing]");
        ws.close();
        return;
      }
      conns.push(ws);
      console.log(`Player ${hi.me} joined as player ${conns.length}`);
      if (conns.length == 1) {
        wss.removeAllListeners("connection");
        resolve(conns);
      }
    });
  });
}

async function main() {
  console.log(`Starting websocket listener on port ${WS_PORT}`);
  const wss = new Server({ port: WS_PORT });

  console.log("Waiting for two players...");
  const conns = await playersConnected(wss);

  console.log("Starting the game loop...");
  const events: Event[] = [];
  const world: WorldState = init(map);
  startGameLoop(world, events);

  conns[0].on("message", (message) => {
    const event = {
      ...(JSON.parse(message.toString("utf-8")) as Event),
      player: 0,
    };
    console.log(event);
  });
}

main();
