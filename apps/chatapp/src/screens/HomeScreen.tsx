import ChatLayout from "@/components/chat-layout";
import { User } from "@/utils/types";
import { useState } from "react";

const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return <ChatLayout initialUser={currentUser} />;
};

export default HomeScreen;
