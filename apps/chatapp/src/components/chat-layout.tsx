import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import ChatArea from "@/components/chat-area";
import { Conversation, User } from "@/utils/types";
import { mockGetConversations, mockUpdateUserStatus } from "@/utils/mock-data";

interface ChatLayoutProps {
  initialUser: User | null;
}

export default function ChatLayout({ initialUser }: ChatLayoutProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      mockUpdateUserStatus(currentUser.id, "online");
      mockGetConversations(currentUser.id).then(setConversations);
    }

    return () => {
      if (currentUser) {
        mockUpdateUserStatus(currentUser.id, "offline");
      }
    };
  }, [currentUser]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex w-full h-full bg-background justify-between">
      <Sidebar
        currentUser={currentUser}
        conversations={conversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <ChatArea
        currentUser={currentUser}
        selectedConversation={selectedConversation}
        toggleMobileMenu={toggleMobileMenu}
      />
    </div>
  );
}
