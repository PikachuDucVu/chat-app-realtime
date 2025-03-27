import { Hono } from "hono";
import ConversationSchema from "../../schema/ConversationSchema";
import { getCookie } from "hono/cookie";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserSchema from "../../schema/UserSchema";

const app = new Hono();

app.get("/getAll", async (c) => {
  const token = getCookie(c, "userToken");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!.toString()) as {
    _id: string;
    email: string;
    username: string;
  };

  try {
    const conversations = await ConversationSchema.find({
      participants: { $in: [decoded._id] },
    })
      .populate("participants")
      .exec();

    return c.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return c.json({ error: "Failed to fetch conversations" }, 500);
  }
});

app.get("/getById/:id", async (c) => {
  const token = getCookie(c, "userToken");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!.toString()) as {
    id: string;
    email: string;
    username: string;
  };

  try {
    const conversation = await ConversationSchema.findById(c.req.param("id"));
    if (!conversation) {
      return c.json({ error: "Conversation not found" }, 404);
    }

    if (
      !conversation.participants.includes(
        new mongoose.Types.ObjectId(decoded.id)
      )
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return c.json({ error: "Failed to fetch conversation" }, 500);
  }
});

app.put("/update/:id", async (c) => {
  const token = getCookie(c, "userToken");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!.toString()) as {
    id: string;
    email: string;
    username: string;
  };

  try {
    const conversation = await ConversationSchema.findById(c.req.param("id"));
    if (!conversation) {
      return c.json({ error: "Conversation not found" }, 404);
    }

    if (
      !conversation.participants.includes(
        new mongoose.Types.ObjectId(decoded.id)
      )
    ) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { name, description } = await c.req.json();

    await ConversationSchema.findByIdAndUpdate(c.req.param("id"), {
      name,
      description,
    });

    return c.json({ message: "Conversation updated successfully" });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return c.json({ error: "Failed to update conversation" }, 500);
  }
});

app.post("/create", async (c) => {
  const token = getCookie(c, "userToken");

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!.toString()) as {
    _id: string;
    email: string;
    username: string;
  };

  try {
    const { type, receiverId } = await c.req.json();

    if (!receiverId || !type) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const receiverInfo = await UserSchema.findById(receiverId);

    if (!receiverInfo) {
      return c.json({ error: "Participant not found" }, 404);
    }

    const existConversation = await ConversationSchema.findOne({
      participants: [decoded._id, receiverInfo._id],
    })
      .populate("participants")
      .exec();

    if (existConversation) {
      return c.json(existConversation);
    }

    const conversation = await ConversationSchema.create({
      type,
      participants: [decoded._id, receiverInfo._id],
      // name,
      createdAt: new Date(),
      lastMessage: null,
      avatar: null,
    });

    const populatedConversation = await ConversationSchema.findById(
      conversation._id
    )
      .populate("participants")
      .exec();

    return c.json(populatedConversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return c.json({ error: "Failed to create conversation" }, 500);
  }
  // app.delete("/delete/:id", async (c) => {
  //   const token = getCookie(c, "userToken");

  //   if (!token) {
  //     return c.json({ error: "Unauthorized" }, 401);
  //   }

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET!.toString()) as {
  //     id: string;
  //     email: string;
  //     username: string;
  //   };

  //   try {
  //     const conversation = await ConversationSchema.findById(c.req.param("id"));
  //     if (!conversation) {
  //       return c.json({ error: "Conversation not found" }, 404);
  //     }

  //     if (
  //       !conversation.participants.includes(
  //         new mongoose.Types.ObjectId(decoded.id)
  //       )
  //     ) {
  //       return c.json({ error: "Unauthorized" }, 401);
  //     }

  //     await ConversationSchema.findByIdAndDelete(c.req.param("id"));

  //     return c.json({ message: "Conversation deleted successfully" });
  //   } catch (error) {
  //     console.error("Error deleting conversation:", error);
  //     return c.json({ error: "Failed to delete conversation" }, 500);
  //   }
  // });
});

export default app;
