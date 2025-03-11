import { createBunWebSocket } from "hono/bun";
import { Hono } from "hono";
import { ServerWebSocket } from "bun";

const app = new Hono();

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

app.get(
  "/",
  upgradeWebSocket((c) => {
    return {
      onOpen() {
        console.log("Connection opened");
      },
      onMessage(event, ws) {
        const data = JSON.parse(event.data.toString());
        if (data.type === "open" && data.roomId) {
          const roomId = data.roomId;
          if (roomId) {
            ws.raw?.subscribe(roomId);
            ws.send(JSON.stringify({ roomId }));
          }
          console.log(roomId);
          return;
        }

        const message = JSON.parse(event.data.toString());
        if (message.type === "message") {
          console.log(`Message from room ${message.roomId}: ${message.text}`);
          ws.raw?.publish(message.roomId, JSON.stringify(message));

          return;
        }
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

export default app;
