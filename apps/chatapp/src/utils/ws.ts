import { hc } from "hono/client";

const client = hc(`${import.meta.env.VITE_BASE_URL}/conversations`);
const ws = client.ws.$ws(0);

export function joinRoom(roomId: string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "join", roomId }));
  } else {
    ws.addEventListener(
      "open",
      () => {
        ws.send(JSON.stringify({ type: "join", roomId }));
      },
      { once: true }
    );
  }

  console.log(`Joining room: ${roomId}`);
}

export function leaveRoom(roomId: string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "leave", roomId }));
    console.log(`Leaving room: ${roomId}`);
  }
}

export function sendMessage(roomId: string, text: string, senderId: string) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        type: "message",
        roomId,
        text,
        senderId,
      })
    );
    console.log(`Sending message to room ${roomId}: ${text}`);
  }
}

export { ws };
