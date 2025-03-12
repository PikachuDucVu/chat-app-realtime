"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Search, Users, Plus, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import NewConversationDialog from "@/components/new-conversation-dialog";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Conversation } from "@/utils/types";

interface SidebarProps {
  currentUser: User | null;
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export default function Sidebar({
  currentUser,
  conversations,
  selectedConversation,
  setSelectedConversation,
  isMobileMenuOpen,
  toggleMobileMenu,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filteredConversations = conversations.filter((conversation) => {
    if (conversation.isGroup && conversation.groupName) {
      return conversation.groupName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    } else {
      // For direct messages, search through participant names
      const otherParticipantId = conversation.participants.find(
        (id) => id !== currentUser?.id
      );
      if (
        otherParticipantId &&
        conversation.participantsInfo[otherParticipantId]
      ) {
        return conversation.participantsInfo[otherParticipantId].displayName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
    }
    return false;
  });

  const getConversationName = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupName;
    } else {
      const otherParticipantId = conversation.participants.find(
        (id) => id !== currentUser?.id
      );
      return otherParticipantId
        ? conversation.participantsInfo[otherParticipantId]?.displayName
        : "Unknown";
    }
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.isGroup) {
      return conversation.groupPhoto;
    } else {
      const otherParticipantId = conversation.participants.find(
        (id) => id !== currentUser?.id
      );
      return otherParticipantId
        ? conversation.participantsInfo[otherParticipantId]?.photoURL
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold">ChatApp</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Avatar>
            <AvatarImage src={currentUser?.photoURL || undefined} />
            <AvatarFallback>
              {currentUser?.displayName
                ? getInitials(currentUser.displayName)
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{currentUser?.displayName}</p>
            <p className="text-xs text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              Online
            </p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Button
          className="w-full mb-2"
          onClick={() => setIsNewConversationOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> New Conversation
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors",
                  selectedConversation?.id === conversation.id && "bg-secondary"
                )}
                onClick={() => {
                  setSelectedConversation(conversation);
                  if (isMobile) toggleMobileMenu();
                }}
              >
                <Avatar>
                  <AvatarImage
                    src={getConversationAvatar(conversation) || undefined}
                  />
                  <AvatarFallback>
                    {conversation.isGroup ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      getInitials(getConversationName(conversation) || "")
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">
                      {getConversationName(conversation)}
                    </p>
                    {conversation.lastMessage?.createdAt && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(
                          conversation.lastMessage.createdAt,
                          {
                            addSuffix: false,
                          }
                        )}
                      </span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.senderId === currentUser?.id
                        ? "You: "
                        : ""}
                      {conversation.lastMessage.text}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery
                ? "No conversations found"
                : "No conversations yet. Start a new one!"}
            </div>
          )}
        </div>
      </ScrollArea>

      <NewConversationDialog
        isOpen={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
        <SheetContent side="left" className="p-0 w-[300px]">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return <div className="w-80 border-r h-full">{sidebarContent}</div>;
}
