import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "@/components/sidebar";
import { Conversation } from "@/utils/types";
import ChatArea from "./chat-area";
import { useAuth } from "@/context/AuthProvider";
import { ConversationAPI } from "@/lib/api";
import { ws, joinRoom, leaveRoom } from "@/utils/ws";
import { useLocation } from "wouter";

export default function ChatLayout() {
  const { userInfo } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentRoomIdRef = useRef<string | null>(null);
  const [, navigate] = useLocation();

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

  const handleRoomChange = (roomId: string) => {
    if (currentRoomIdRef.current === roomId) return;

    if (currentRoomIdRef.current) {
      leaveRoom(currentRoomIdRef.current);
    }

    joinRoom(roomId);
    currentRoomIdRef.current = roomId;
    navigate(`/${roomId}`);
  };

  useEffect(() => {
    return () => {
      if (currentRoomIdRef.current) {
        leaveRoom(currentRoomIdRef.current);
      }
    };
  }, []);

  return (
    <div className="flex w-full h-full bg-background justify-between">
      <Sidebar
        currentUser={userInfo}
        conversations={conversations}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        onRoomChange={handleRoomChange}
        currentRoomId={currentRoomIdRef.current}
      />
      <ChatArea
        currentUser={userInfo}
        toggleMobileMenu={toggleMobileMenu}
        currentRoomId={currentRoomIdRef.current}
      />
    </div>
  );
}
