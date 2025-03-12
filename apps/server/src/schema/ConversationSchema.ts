import mongoose, { Schema, InferSchemaType } from "mongoose";

const ConversationSchema = new Schema({
  type: {
    type: String,
    enum: ["direct", "group"],
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  name: String,
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "Message",
  },
  avatar: String,
  description: String,
});

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ type: 1, lastMessage: -1 });

export type Conversation = InferSchemaType<typeof ConversationSchema>;
export default mongoose.model<Conversation>("Conversation", ConversationSchema);
