export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  participants: User[];
  name?: string;
  admin?: User;
  createdAt: Date;
  lastMessage?: Message;
  avatar?: string;
  description?: string;
}

export interface Message {
  id: string;
  conversation: Conversation;
  sender: User;
  content?: string;
  attachments: Array<{
    type: "file" | "image";
    url?: string;
    filename?: string;
    size?: number;
    mimeType?: string;
    thumbnail?: string;
  }>;
  readBy: Array<{
    user: User;
    readAt: Date;
  }>;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface File {
  id: string;
  uploader?: User;
  url: string;
  filename: string;
  size?: number;
  mimeType?: string;
  createdAt: Date;
}
