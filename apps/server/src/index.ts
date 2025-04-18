import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";
import chatWs from "./ws/chat";
import mongoose from "mongoose";
import UserAPI from "./services/api/UserAPI";
import Conversation from "./services/api/Conversation";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.APP_CONTENT_URL || "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  })
);

app.use(logger());
try {
  mongoose.connect(process.env.MONGO_URI as string);
  console.log("MongoDB connected successfully");
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
}
app.get("/", (c) => c.text("Duc Vu API Server Running..."));
const { websocket } = createBunWebSocket<ServerWebSocket>();

Bun.serve({
  port: 3000,
  fetch: app.fetch,
  websocket,
});

app.route("/ws", chatWs);
app.route("/user", UserAPI);
app.route("/conversations", Conversation);

export default app;
