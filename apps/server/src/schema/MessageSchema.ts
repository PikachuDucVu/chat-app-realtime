import mongoose, { Schema, InferSchemaType } from "mongoose";

const MessageSchema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: String,
  attachments: [
    {
      type: { type: String, enum: ["file", "image"] },
      url: String,
      filename: String,
      size: Number,
      mimeType: String,
      thumbnail: String,
    },
  ],
  readBy: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      readAt: Date,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  deletedAt: Date,
});

MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

export type Message = InferSchemaType<typeof MessageSchema>;
export default mongoose.model<Message>("Message", MessageSchema);
