// Mock Users
export const mockUsers = [
  {
    id: "user1",
    displayName: "John Doe",
    email: "john@example.com",
    photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
    status: "online",
    lastSeen: new Date(),
    createdAt: new Date(),
  },
  {
    id: "user2",
    displayName: "Jane Smith",
    email: "jane@example.com",
    photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=Jane",
    status: "offline",
    lastSeen: new Date(),
    createdAt: new Date(),
  },
  {
    id: "user3",
    displayName: "Alice Johnson",
    email: "alice@example.com",
    photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=Alice",
    status: "online",
    lastSeen: new Date(),
    createdAt: new Date(),
  },
];

// Mock Conversations
export const mockConversations = [
  {
    id: "conv1",
    participants: ["user1", "user2"],
    participantsInfo: {
      user1: {
        displayName: "John Doe",
        photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
      },
      user2: {
        displayName: "Jane Smith",
        photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=Jane",
      },
    },
    lastMessage: {
      text: "Hey, how are you?",
      senderId: "user2",
      createdAt: new Date(), // Ensure this is a Date object
    },
    isGroup: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "user1",
  },
  {
    id: "conv2",
    participants: ["user1", "user2", "user3"],
    participantsInfo: {
      user1: {
        displayName: "John Doe",
        photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
      },
      user2: {
        displayName: "Jane Smith",
        photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=Jane",
      },
      user3: {
        displayName: "Alice Johnson",
        photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=Alice",
      },
    },
    lastMessage: {
      text: "Group meeting at 3 PM",
      senderId: "user3",
      createdAt: new Date(), // Ensure this is a Date object
    },
    isGroup: true,
    groupName: "Project Team",
    groupPhoto: "https://api.dicebear.com/6.x/identicon/svg?seed=ProjectTeam",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: "user1",
  },
];

// Mock Messages
export const mockMessages = {
  conv1: [
    {
      id: "msg1",
      text: "Hey, how are you?",
      senderId: "user2",
      createdAt: new Date(Date.now() - 3600000),
      read: true,
    },
    {
      id: "msg2",
      text: "I'm good, thanks! How about you?",
      senderId: "user1",
      createdAt: new Date(Date.now() - 3500000),
      read: true,
    },
    {
      id: "msg3",
      text: "Doing well. Want to grab lunch later?",
      senderId: "user2",
      createdAt: new Date(Date.now() - 3400000),
      read: false,
    },
  ],
  conv2: [
    {
      id: "msg4",
      text: "Hello everyone!",
      senderId: "user1",
      createdAt: new Date(Date.now() - 7200000),
      read: true,
    },
    {
      id: "msg5",
      text: "Hi John!",
      senderId: "user3",
      createdAt: new Date(Date.now() - 7100000),
      read: true,
    },
    {
      id: "msg6",
      text: "Group meeting at 3 PM",
      senderId: "user3",
      createdAt: new Date(Date.now() - 7000000),
      read: false,
    },
  ],
};

// Mock Authentication
let currentUser = null;

export const mockSignIn = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === "password") {
        currentUser = user;
        resolve(user);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
};

export const mockSignUp = (name: string, email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.some((u) => u.email === email)) {
        reject(new Error("Email already in use"));
      } else {
        const newUser = {
          id: `user${mockUsers.length + 1}`,
          displayName: name,
          email,
          photoURL: `https://api.dicebear.com/6.x/avataaars/svg?seed=${name}`,
          status: "online",
          lastSeen: new Date(),
          createdAt: new Date(),
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
      resolve(mockUsers[0]); // Always return the first user as the current user
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
  message: Omit<Message, "id">
): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        ...message,
        id: `msg${Date.now()}`,
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
          text: newMessage.text,
          senderId: newMessage.senderId,
          createdAt: newMessage.createdAt, // This should already be a Date object
        };
        conversation.updatedAt = new Date();
      }

      resolve(newMessage);
    }, 500);
  });
};

export const mockCreateConversation = (
  newConversation: Omit<Conversation, "id" | "createdAt" | "updatedAt">
): Promise<Conversation> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const conversation: Conversation = {
        ...newConversation,
        id: `conv${mockConversations.length + 1}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockConversations.push(conversation);
      resolve(conversation);
    }, 500);
  });
};

export const mockUpdateUserStatus = (
  userId: string,
  status: "online" | "offline"
): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === userId);
      if (user) {
        user.status = status;
        user.lastSeen = new Date();
      }
      resolve();
    }, 500);
  });
};
