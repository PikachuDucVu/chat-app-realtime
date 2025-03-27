// Mock Users
export const mockUsers = [
  {
    id: "user1",
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    profilePicture: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user2",
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123",
    profilePicture: "https://api.dicebear.com/6.x/avataaars/svg?seed=Jane",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "user3",
    username: "alice_johnson",
    email: "alice@example.com",
    password: "password123",
    profilePicture: "https://api.dicebear.com/6.x/avataaars/svg?seed=Alice",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface Conversation {
  id: string;
  type: string;
  participants: string[];
  name: string | null;
  admin: string;
  createdAt: Date;
  lastMessage: {
    id: string;
    text: string;
    sender: string;
    createdAt: Date;
  } | null;
  avatar: string | null;
  description: string | null;
  isGroup: boolean;
}

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    type: "direct",
    participants: ["user1", "user2"],
    name: null,
    admin: "user1",
    createdAt: new Date(),
    lastMessage: {
      id: "msg2",
      text: "I'm good, thanks! How about you?",
      sender: "user1",
      createdAt: new Date(Date.now() - 3500000),
    },
    avatar: null,
    description: null,
    isGroup: false,
  },
  {
    id: "conv2",
    type: "group",
    participants: ["user1", "user2", "user3"],
    name: "Project Team",
    admin: "user1",
    createdAt: new Date(),
    lastMessage: {
      id: "msg6",
      text: "Group meeting at 3 PM",
      sender: "user3",
      createdAt: new Date(Date.now() - 7000000),
    },
    avatar: "https://api.dicebear.com/6.x/identicon/svg?seed=ProjectTeam",
    description: "Team collaboration space",
    isGroup: true,
  },
];

// Mock Messages
interface Message {
  id: string;
  conversation: string;
  sender: string;
  content: string;
  attachments: Array<{ type: string; url: string; previewUrl: string }>;
  readBy: Array<{ user: string; readAt: Date }>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface ConversationMessages {
  [key: string]: Message[];
}

export const mockMessages: ConversationMessages = {
  conv1: [
    {
      id: "msg-1a2b3c4d",
      conversation: "conv1",
      sender: "user2",
      content: "Hey John, how's it going? Long time no see! 😊",
      attachments: [
        {
          type: "image",
          url: "https://picsum.photos/200/300",
          previewUrl: "https://picsum.photos/50/50",
        },
      ],
      readBy: [
        {
          user: "user1",
          readAt: new Date("2025-03-18T12:15:00Z"),
        },
      ],
      createdAt: new Date("2025-03-18T12:10:00Z"),
      updatedAt: new Date("2025-03-18T12:10:00Z"),
      deletedAt: null,
    },
    {
      id: "msg-2b3c4d5e",
      conversation: "conv1",
      sender: "user1",
      content:
        "Hey Jane! I'm doing great, just finished a big project. How about you? 🎉",
      attachments: [],
      readBy: [
        {
          user: "user2",
          readAt: new Date("2025-03-18T12:20:00Z"),
        },
      ],
      createdAt: new Date("2025-03-18T12:15:00Z"),
      updatedAt: new Date("2025-03-18T12:15:00Z"),
      deletedAt: null,
    },
    {
      id: "msg-3c4d5e6f",
      conversation: "conv1",
      sender: "user2",
      content:
        "That's awesome! I'm good too, just got back from vacation. Here's a pic from my trip:",
      attachments: [
        {
          type: "image",
          url: "https://picsum.photos/400/600",
          previewUrl: "https://picsum.photos/50/50",
        },
      ],
      readBy: [],
      createdAt: new Date("2025-03-18T12:25:00Z"),
      updatedAt: new Date("2025-03-18T12:25:00Z"),
      deletedAt: null,
    },
  ],
  conv2: [
    {
      id: "msg-4d5e6f7g",
      conversation: "conv2",
      sender: "user1",
      content: "Hello team! Just a reminder about our project deadlines:",
      attachments: [
        {
          type: "document",
          url: "https://example.com/project-plan.pdf",
          previewUrl: "https://example.com/project-plan-thumbnail.jpg",
        },
      ],
      readBy: [
        {
          user: "user2",
          readAt: new Date("2025-03-18T10:05:00Z"),
        },
        {
          user: "user3",
          readAt: new Date("2025-03-18T10:10:00Z"),
        },
      ],
      createdAt: new Date("2025-03-18T10:00:00Z"),
      updatedAt: new Date("2025-03-18T10:00:00Z"),
      deletedAt: null,
    },
    {
      id: "msg-5e6f7g8h",
      conversation: "conv2",
      sender: "user3",
      content:
        "Got it! Let's schedule a meeting to discuss - how about tomorrow at 3 PM?",
      attachments: [],
      readBy: [
        {
          user: "user1",
          readAt: new Date("2025-03-18T10:15:00Z"),
        },
        {
          user: "user2",
          readAt: new Date("2025-03-18T10:20:00Z"),
        },
      ],
      createdAt: new Date("2025-03-18T10:10:00Z"),
      updatedAt: new Date("2025-03-18T10:10:00Z"),
      deletedAt: null,
    },
    {
      id: "msg-6f7g8h9i",
      conversation: "conv2",
      sender: "user2",
      content: "3 PM works for me! I'll send out the calendar invite.",
      attachments: [],
      readBy: [],
      createdAt: new Date("2025-03-18T10:15:00Z"),
      updatedAt: new Date("2025-03-18T10:15:00Z"),
      deletedAt: null,
    },
  ],
};

// Mock Authentication
interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}

let currentUser: User | undefined = null;

export const mockSignIn = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === user.password) {
        currentUser = user;
        resolve(user);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
};

export const mockSignUp = (
  username: string,
  email: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.some((u) => u.email === email || u.username === username)) {
        reject(new Error("Email or username already in use"));
      } else {
        const newUser = {
          id: `user${mockUsers.length + 1}`,
          username,
          email,
          password,
          profilePicture: `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        mockUsers.push(newUser);
        currentUser = newUser;
        resolve(newUser);
      }
    }, 500);
  });
};

export const mockGetCurrentUser = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(currentUser);
    }, 500);
  });
};

// Mock Data Operations
export const mockGetConversations = (userId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userConversations = mockConversations.filter((conv) =>
        conv.participants.includes(userId)
      );
      resolve(userConversations);
    }, 500);
  });
};

export const mockGetMessages = (conversationId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages[conversationId] || []);
    }, 500);
  });
};

export const mockSendMessage = (
  conversationId: string,
  message: {
    content: string;
    sender: string;
    attachments?: Array<{ type: string; url: string; previewUrl: string }>;
  }
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage = {
        id: `msg${Date.now()}`,
        conversation: conversationId,
        sender: message.sender,
        content: message.content,
        attachments: message.attachments || [],
        readBy: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      if (!mockMessages[conversationId]) {
        mockMessages[conversationId] = [];
      }
      mockMessages[conversationId].push(newMessage);

      const conversation = mockConversations.find(
        (conv) => conv.id === conversationId
      );
      if (conversation) {
        conversation.lastMessage = {
          id: newMessage.id,
          text: newMessage.content,
          sender: newMessage.sender,
          createdAt: newMessage.createdAt,
        };
      }

      resolve(newMessage);
    }, 500);
  });
};

export const mockUpdateUserStatus = (userId: string, status: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === userId);
      if (user) {
        console.log(`User ${user.username} is now ${status}`);
      }
      resolve(null);
    }, 500);
  });
};

export const mockCreateConversation = (newConversation: {
  type: string;
  participants: string[];
  name: string | null;
  admin: string;
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation = {
        ...newConversation,
        id: `conv${mockConversations.length + 1}`,
        createdAt: new Date(),
        lastMessage: null,
        avatar: null,
        description: null,
        isGroup: newConversation.type === "group",
      };
      mockConversations.push(conversation);
      resolve(conversation);
    }, 500);
  });
};
