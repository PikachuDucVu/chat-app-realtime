"use client";

import { useState, useEffect, useCallback } from "react";
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
import { mockUsers } from "@/utils/mock-data";
import { Conversation, User } from "@/utils/types";
import { UserAPI } from "@/lib/api";
interface AddParticipantsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  currentUser: User | undefined;
}

export default function AddParticipantsDialog({
  isOpen,
  onClose,
  conversation,
  currentUser,
}: AddParticipantsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  console.log("dcm");

  const searchUsers = useCallback(async () => {
    const friends = await UserAPI.getListFriends();
    console.log(friends);
  }, [currentUser]);

  useEffect(() => {
    if (isOpen && searchQuery.length >= 2) {
      searchUsers();
    }
  }, [searchQuery, isOpen, searchUsers]);

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleAddParticipants = async () => {
    if (!currentUser || selectedUsers.length === 0) return;

    setIsLoading(true);

    // try {
    //   const conversationRef = doc(db, "conversations", conversation.id);

    //   // Update participants array
    //   await updateDoc(conversationRef, {
    //     participants: arrayUnion(...selectedUsers.map((u) => u.id)),
    //   });

    //   // Update participants info
    //   for (const user of selectedUsers) {
    //     await updateDoc(conversationRef, {
    //       [`participantsInfo.${user.id}`]: {
    //         displayName: user.displayName,
    //         photoURL: user.photoURL,
    //       },
    //     });
    //   }

    //   toast({
    //     title: "Participants added",
    //     description: `${selectedUsers.length} user(s) added to the conversation`,
    //   });

    //   // Reset form
    //   setSelectedUsers([]);
    //   setSearchQuery("");
    //   onClose();
    // } catch (error: any) {
    //   toast({
    //     title: "Error adding participants",
    //     description: error.message,
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
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
          <DialogTitle>Add Participants</DialogTitle>
          <DialogDescription>
            Add more users to this group conversation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
                    <span>{user.displayName}</span>
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
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback>
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleAddParticipants}
            disabled={selectedUsers.length === 0 || isLoading}
          >
            {isLoading ? "Adding..." : "Add Participants"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
