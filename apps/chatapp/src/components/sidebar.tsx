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
import { Conversation, User } from "@/utils/types";
import { useRoute } from "wouter";

interface SidebarProps {
  currentUser: User | undefined;
  conversations: Conversation[];
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  onRoomChange: (roomId: string) => void;
  currentRoomId: string | null;
}

export default function Sidebar({
  currentUser,
  conversations,
  isMobileMenuOpen,
  toggleMobileMenu,
  onRoomChange,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [, params] = useRoute("/chat/:id");

  const filteredConversations = conversations.filter((conversation) => {
    return conversation;
  });

  const getConversationAvatar = (conversation: Conversation) => {
    return conversation.avatar;
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

  const handleConversationClick = (conversationId: string) => {
    onRoomChange(conversationId);
    if (isMobile) toggleMobileMenu();
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
            <AvatarImage src={currentUser?.profilePicture || undefined} />
            <AvatarFallback>
              {currentUser?.username ? getInitials(currentUser.username) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{currentUser?.username}</p>
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
          className="w-full mb-2 text-black"
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
                key={conversation._id}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors",
                  params?.id === conversation._id && "bg-secondary"
                )}
                onClick={() => handleConversationClick(conversation._id)}
              >
                <Avatar>
                  <AvatarImage
                    src={getConversationAvatar(conversation) || undefined}
                  />
                  <AvatarFallback>
                    {conversation.type === "group" ? (
                      <Users className="h-4 w-4" />
                    ) : conversation.participants.find(
                        (p) => p._id !== currentUser?._id
                      )?.username ? (
                      getInitials(
                        conversation.participants.find(
                          (p) => p._id !== currentUser?._id
                        )?.username!
                      )
                    ) : (
                      conversation.participants.map((p) =>
                        getInitials(p.username!)
                      )
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">
                      {conversation.name
                        ? conversation.name
                        : conversation.participants
                            .filter((p) => p._id !== currentUser?._id)
                            .map((p) => p.username)
                            .join(", ")}
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
                      {conversation.lastMessage ? "You: " : ""}
                      {conversation.lastMessage.content}
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
