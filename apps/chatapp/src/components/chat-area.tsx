import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, Send, Info, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { User, Message, Conversation } from "@/utils/types";
import { ws } from "@/utils/ws";
import { ConversationAPI } from "@/lib/api";

interface ChatAreaProps {
  currentUser: User | undefined;
  toggleMobileMenu: () => void;
  currentRoomId: string | null;
}

export default function ChatArea({
  currentUser,
  toggleMobileMenu,
  currentRoomId,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentRoomId) return;

    // Fetch existing messages when conversation changes
    const fetchMessages = async () => {
      try {
        const response = await ConversationAPI.getMessages(currentRoomId);
        const mappedMessages = response
          .map((msg: any) => ({
            _id: msg._id,
            content: msg.content || msg.text,
            sender: {
              _id: msg.sender,
              username: "",
              email: "",
              password: "",
              createdAt: new Date(),
              profilePicture: "",
              status: undefined,
            },
            conversation: {
              _id: msg.conversation,
              participants: [],
              type: "direct" as const,
              createdAt: new Date(),
            },
            attachments: [],
            readBy: [],
            createdAt: new Date(msg.createdAt),
          }))
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        setMessages(mappedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    const messageHandler = (event: MessageEvent) => {
      console.log("WebSocket message received:", event.data);
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === "message" && data.roomId === currentRoomId) {
        console.log("Processing new message:", data);
        const minimalConversation: Conversation = {
          _id: currentRoomId,
          participants: [],
          type: "direct",
          createdAt: new Date(),
        };

        const minimalUser: User = {
          _id: data.senderId,
          username: "",
          email: "",
          password: "",
          createdAt: new Date(),
          profilePicture: "",
          status: undefined,
        };

        const newMsg = {
          _id: data._id || Date.now().toString(),
          content: data.content || data.text || "",
          sender: minimalUser,
          conversation: minimalConversation,
          attachments: [],
          readBy: [],
          createdAt: new Date(data.createdAt || Date.now()),
        };
        console.log("Adding new message:", newMsg);
        setMessages((prev) => {
          const updated = [...prev, newMsg].sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
          console.log("Updated messages:", updated);
          return updated;
        });
      }
    };

    console.log("Registering WebSocket handler for room:", currentRoomId);
    ws.addEventListener("message", messageHandler);

    return () => {
      ws.removeEventListener("message", messageHandler);
    };
  }, [currentRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentRoomId || !currentUser?._id) return;

    const messageData = {
      type: "message",
      roomId: currentRoomId,
      text: newMessage,
      senderId: currentUser._id,
      content: newMessage,
    };
    console.log("Sending message:", messageData);
    ws.send(JSON.stringify(messageData));

    const newMsg: Message = {
      _id: Date.now().toString(),
      content: newMessage,
      sender: currentUser,
      conversation: {
        _id: currentRoomId,
        participants: [],
        type: "direct",
        createdAt: new Date(),
      },
      attachments: [],
      readBy: [],
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);

    setNewMessage("");
  };

  if (!currentRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No conversation selected</h3>
          <p className="text-muted-foreground">
            Choose a conversation from the sidebar or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full relative">
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {/* {
          <h2 className="text-lg font-semibold">
            {currentConversation!.participants.filter(
              (participant) => participant._id !== currentUser?._id
            )[0]?.username || "Conversation"}
            dcm
          </h2>
        } */}
        <Button variant="ghost" size="icon" onClick={() => setIsInfoOpen(true)}>
          <Info className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea
        className="flex-1 p-4 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 144px)" }}
      >
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.sender._id === currentUser?._id;
              return (
                <div
                  key={message._id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.createdAt && format(message.createdAt, "p")}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="border-t p-3 flex gap-2 bg-background absolute bottom-0 left-0 right-0"
      >
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
