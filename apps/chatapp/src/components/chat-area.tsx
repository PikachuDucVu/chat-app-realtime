import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, Send, Info, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ConversationInfo from "@/components/conversation-info";
import { mockGetMessages, mockSendMessage } from "@/utils/mock-data";
import { User, Conversation } from "@/utils/types";
import { Message } from "react-hook-form";

interface ChatAreaProps {
  currentUser: User | null;
  selectedConversation: Conversation | null;
  toggleMobileMenu: () => void;
}

export default function ChatArea({
  currentUser,
  selectedConversation,
  toggleMobileMenu,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedConversation) {
      mockGetMessages(selectedConversation.id).then(setMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    try {
      const message: Omit<Message, "id"> = {
        text: newMessage,
        senderId: currentUser.id,
        createdAt: new Date(),
        read: false,
      };

      const sentMessage = await mockSendMessage(
        selectedConversation.id,
        message
      );
      setMessages([...messages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getConversationName = () => {
    if (!selectedConversation || !currentUser) return "Select a conversation";

    if (selectedConversation.isGroup) {
      return selectedConversation.groupName;
    } else {
      const otherParticipantId = selectedConversation.participants.find(
        (id) => id !== currentUser.id
      );
      return otherParticipantId
        ? selectedConversation.participantsInfo[otherParticipantId]?.displayName
        : "Unknown";
    }
  };

  const getConversationAvatar = () => {
    if (!selectedConversation || !currentUser) return null;

    if (selectedConversation.isGroup) {
      return selectedConversation.groupPhoto;
    } else {
      const otherParticipantId = selectedConversation.participants.find(
        (id) => id !== currentUser.id
      );
      return otherParticipantId
        ? selectedConversation.participantsInfo[otherParticipantId]?.photoURL
        : null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!selectedConversation) {
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
    <div className="flex-1 flex flex-col h-full">
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
          <Avatar>
            <AvatarImage src={getConversationAvatar() || undefined} />
            <AvatarFallback>
              {selectedConversation.isGroup ? (
                <Users className="h-4 w-4" />
              ) : (
                getInitials(getConversationName() || "")
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{getConversationName()}</p>
            {!selectedConversation.isGroup && (
              <p className="text-xs text-muted-foreground">
                {selectedConversation.participantsInfo[
                  selectedConversation.participants.find(
                    (id) => id !== currentUser?.id
                  ) || ""
                ]?.status === "online" ? (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                    Online
                  </>
                ) : (
                  "Offline"
                )}
              </p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsInfoOpen(true)}>
          <Info className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser?.id;
              return (
                <div
                  key={message.id}
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
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.createdAt &&
                        format(message.createdAt.toDate(), "p")}
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

      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
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

      <ConversationInfo
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        conversation={selectedConversation}
        currentUser={currentUser}
      />
    </div>
  );
}
