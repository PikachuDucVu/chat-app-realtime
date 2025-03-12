import mongoose from "mongoose";
import User from "../schema/UserSchema";
import Conversation from "../schema/ConversationSchema";
import Message from "../schema/MessageSchema";
import File from "../schema/FileSchema";

async function initData() {
  // Connect to MongoDB
  await mongoose.connect("mongodb://localhost:27017/chat-app");

  // Create a user
  const user = await User.create({
    username: "testuser",
    email: "test@example.com",
    password: "password123",
    profilePicture: "https://example.com/profile.jpg",
  });

  // Create a conversation
  const conversation = await Conversation.create({
    type: "direct",
    participants: [user._id],
    name: "Test Conversation",
    admin: user._id,
  });

  // Create a message
  const message = await Message.create({
    conversation: conversation._id,
    sender: user._id,
    content: "Hello, this is a test message!",
  });

  // Update conversation with last message
  await Conversation.findByIdAndUpdate(conversation._id, {
    lastMessage: message._id,
  });

  // Create a file
  const file = await File.create({
    uploader: user._id,
    url: "https://example.com/file.pdf",
    filename: "document.pdf",
    size: 1024,
    mimeType: "application/pdf",
  });

  console.log("Data initialization complete!");
  console.log({
    user,
    conversation,
    message,
    file,
  });

  await mongoose.disconnect();
}

initData().catch((err) => {
  console.error("Error initializing data:", err);
  process.exit(1);
});
