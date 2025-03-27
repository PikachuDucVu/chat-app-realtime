"use client";

import { useState, useEffect } from "react";
import { User } from "@/utils/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { mockCreateConversation, mockUsers } from "@/utils/mock-data";

interface NewConversationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | undefined;
}

export default function NewConversationDialog({
  isOpen,
  onClose,
  currentUser,
}: NewConversationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isGroup, setIsGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && searchQuery.length >= 2) {
      const filteredUsers: User[] = mockUsers.filter(
        (user) =>
          user.id !== currentUser?._id &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
      ) as User[];
      setUsers(filteredUsers);
    }
  }, [searchQuery, isOpen, currentUser]);

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateConversation = async () => {
    if (!currentUser || selectedUsers.length === 0) return;

    if (isGroup && !groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for the group conversation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const conversationData = {
        type: isGroup ? "group" : "direct",
        participants: [currentUser._id, ...selectedUsers.map((u) => u._id)],
        name: isGroup ? groupName : undefined,
        admin: currentUser._id,
      };

      await mockCreateConversation(conversationData);

      toast({
        title: "Conversation created",
        description: isGroup
          ? `Group "${groupName}" has been created`
          : `Conversation with ${selectedUsers.map((u) => u.username).join(", ")} started`,
      });

      setSelectedUsers([]);
      setIsGroup(false);
      setGroupName("");
      setSearchQuery("");
      onClose();
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Error creating conversation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Start a new conversation with one or more users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isGroup"
              checked={isGroup}
              onCheckedChange={(checked: boolean) =>
                setIsGroup(checked as boolean)
              }
            />
            <Label htmlFor="isGroup">Create a group chat</Label>
          </div>

          {isGroup && (
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Select Users</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm"
                  >
                    <span>{user.username}</span>
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleUserSelection(user)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <ScrollArea className="h-[200px] border rounded-md">
              {users.length > 0 ? (
                <div className="p-2">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer"
                      onClick={() => toggleUserSelection(user)}
                    >
                      <Checkbox
                        checked={selectedUsers.some((u) => u._id === user._id)}
                        onCheckedChange={() => toggleUserSelection(user)}
                      />
                      <Avatar>
                        <AvatarImage src={user.profilePicture || undefined} />
                        <AvatarFallback>
                          {getInitials(user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery.length < 2
                    ? "Type at least 2 characters to search"
                    : "No users found"}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateConversation}
            disabled={
              selectedUsers.length === 0 ||
              isLoading ||
              (isGroup && !groupName.trim())
            }
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
