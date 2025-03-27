import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/sidebar";
import { Conversation } from "@/utils/types";
import ChatArea from "./chat-area";
import { useAuth } from "@/context/AuthProvider";
import { ConversationAPI } from "@/lib/api";

export default function ChatLayout() {
  const { userInfo } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchConversations = useCallback(async () => {
    const conversations = await ConversationAPI.getAll();
    setConversations(conversations);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex w-full h-full bg-background justify-between">
      <Sidebar
        currentUser={userInfo}
        conversations={conversations}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <ChatArea currentUser={userInfo} toggleMobileMenu={toggleMobileMenu} />
    </div>
  );
}
