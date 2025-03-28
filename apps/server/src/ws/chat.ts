import { createBunWebSocket } from "hono/bun";
import { ServerWebSocket } from "bun";
import Conversation from "../services/api/Conversation";
import ConversationSchema from "../schema/ConversationSchema";
import MessageSchema from "../schema/MessageSchema";
import mongoose from "mongoose";

const app = Conversation;

const { upgradeWebSocket } = createBunWebSocket<ServerWebSocket>();

app.get(
  "/ws",
  upgradeWebSocket(() => {
    return {
      onOpen() {
        console.log("Connection opened");
      },
      async onMessage(event, ws) {
        const data = JSON.parse(event.data.toString());
        console.log("WebSocket message received:", event.data);
        if (data.type === "join" && data.roomId) {
          const roomId = data.roomId;

          if (!mongoose.Types.ObjectId.isValid(roomId)) {
            ws.send(
              JSON.stringify({
                error: "Invalid room ID format",
                details: "Room ID must be a 24 character hex string",
              })
            );
            ws.close();
            return;
          }

          const conversation = await ConversationSchema.findById({
            _id: roomId,
          });

          if (!conversation) {
            ws.send(JSON.stringify({ error: "Conversation not found" }));
            ws.close();
            return;
          }

          ws.send(
            JSON.stringify({
              type: "conversation",
              data: conversation,
            })
          );
          ws.raw?.subscribe(roomId);
          ws.send(JSON.stringify({ roomId }));
          return;
        }

        const message = JSON.parse(event.data.toString());
        if (message.type === "message") {
          console.log(
            `Message of user ${message.senderId} room ${message.roomId}: ${message.text}`
          );

          try {
            // First find the conversation
            const conversation = await ConversationSchema.findById(
              message.roomId
            );

            if (!conversation) {
              ws.send(JSON.stringify({ error: "Conversation not found" }));
              return;
            }

            // Create new message document
            const newMessage = await MessageSchema.create({
              conversation: conversation._id,
              sender: message.senderId,
              content: message.text,
              attachments: [],
              readBy: [],
            });

            // Update conversation's lastMessage reference with the new message's ID
            await ConversationSchema.findByIdAndUpdate(message.roomId, {
              lastMessage: newMessage._id,
            });

            console.log("Message saved to database:", newMessage);

            // Prepare message with database ID
            const messageWithId = {
              ...message,
              _id: newMessage._id,
              createdAt: newMessage.createdAt,
            };

            // Broadcast to all subscribers including sender
            ws.raw?.publish(message.roomId, JSON.stringify(messageWithId));
            // log who is subscribed to the room
          } catch (error) {
            console.error("Error saving message:", error);
            const errorMessage =
              error instanceof Error ? error.message : "Unknown error";
            ws.send(
              JSON.stringify({
                error: "Failed to save message",
                details: errorMessage,
              })
            );
          }
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
