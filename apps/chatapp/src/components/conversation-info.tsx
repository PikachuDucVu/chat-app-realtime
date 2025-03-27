"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, Trash2, LogOut } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddParticipantsDialog from "@/components/add-participants-dialog";
import { Conversation, User } from "@/utils/types";

interface ConversationInfoProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation;
  currentUser: User | undefined;
}

export default function ConversationInfo({
  isOpen,
  onClose,
  conversation,
  currentUser,
}: ConversationInfoProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [isAddParticipantsOpen, setIsAddParticipantsOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteConversation = async () => {
    try {
      // In a real app, you would delete the conversation from the database here
      // For now, we'll just show a toast message
      onClose();
      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently deleted.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete conversation";
      toast({
        title: "Error deleting conversation",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleLeaveConversation = async () => {
    if (!currentUser) return;

    try {
      // In a real app, you would remove the user from the conversation here
      // For now, we'll just show a toast message
      onClose();
      toast({
        title: "Left conversation",
        description: "You have left the conversation.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to leave conversation";
      toast({
        title: "Error leaving conversation",
        description: message,
        variant: "destructive",
      });
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
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Conversation Info</SheetTitle>
            <SheetDescription>
              View details about this conversation
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage
                  src={
                    conversation.type === "group"
                      ? conversation.avatar
                      : conversation.participants.find(
                          (p) => p._id !== currentUser?._id
                        )?.profilePicture || undefined
                  }
                />
                <AvatarFallback className="text-lg">
                  {conversation.type === "group" ? (
                    <Users className="h-8 w-8" />
                  ) : (
                    getInitials(
                      conversation.participants.find(
                        (p) => p._id !== currentUser?._id
                      )?.username || ""
                    )
                  )}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">
                {conversation.type === "group"
                  ? conversation.name
                  : conversation.participants.find(
                      (p) => p._id !== currentUser?._id
                    )?.username}
              </h3>
              {conversation.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Created {format(conversation.createdAt, "PPP")}
                </p>
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Participants</h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {conversation.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center gap-3 p-2 rounded-lg"
                    >
                      <Avatar>
                        <AvatarImage
                          src={participant.profilePicture || undefined}
                        />
                        <AvatarFallback>
                          {getInitials(participant.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {participant.username}
                          {participant._id === currentUser?._id && " (You)"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {conversation.type === "group" && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setIsAddParticipantsOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Add Participants
              </Button>
            )}

            <Separator className="my-4" />

            <div className="space-y-2">
              {conversation.type === "group" &&
              conversation.admin?._id === currentUser?._id ? (
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete Conversation
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the conversation and all messages within it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteConversation}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog
                  open={isLeaveDialogOpen}
                  onOpenChange={setIsLeaveDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" /> Leave Conversation
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Leave Conversation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to leave this conversation? You
                        will no longer receive messages from this conversation.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLeaveConversation}>
                        Leave
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AddParticipantsDialog
        isOpen={isAddParticipantsOpen}
        onClose={() => setIsAddParticipantsOpen(false)}
        conversation={conversation}
        currentUser={currentUser}
      />
    </>
  );
}
