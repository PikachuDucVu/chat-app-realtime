import { hc } from "hono/client";
const client = hc(`${import.meta.env.VITE_BASE_URL}/conversations`);
const ws = client.ws.$ws(0);

// ws.addEventListener("open", () => {
//   // get chat ID from /chat/{id} path
//   const path = window.location.pathname;
//   if (!path.includes("/chat/")) {
//     // console.error("Invalid chat URL format");
//     return;
//   }
//   const roomId = path.split("/chat/")[1].split("/")[0];

//   ws.send(JSON.stringify({ type: "open", roomId }));
//   console.log("joined", roomId);
// });

// // Add leave room handler
// ws.addEventListener("close", () => {
//   const path = window.location.pathname;
//   if (path.includes("/chat/")) {
//     const roomId = path.split("/chat/")[1].split("/")[0];
//     ws.send(JSON.stringify({ type: "leave", roomId }));
//     console.log("left", roomId);
//   }
// });

export { ws };
