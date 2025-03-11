import { hc } from "hono/client";

const client = hc("http://localhost:3000");
const ws = client.ws.$ws(0);

ws.addEventListener("open", () => {
  // get params from url
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get("roomId");

  ws.send(JSON.stringify({ type: "open", roomId }));
  console.log(roomId);
});

export { ws };
