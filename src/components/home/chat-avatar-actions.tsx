import { IMessage, useConversationStore } from "@/store/chat-store";
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import React from "react";

type ChatAvatarActionsProps = {
  message: IMessage;
  me: any;
};

const ChatAvatarActions = ({ message, me }: ChatAvatarActionsProps) => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const isMember =
    selectedConversation?.participants.includes(message.sender._id) || false;

  const removeUser = useMutation(api.conversations.removeUser);
  const createConversation = useMutation(api.conversations.createConversation);

  const handleRemoveUser = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedConversation) return;
    try {
      await removeUser({
        conversationId: selectedConversation!._id,
        userId: message.sender._id,
      });

      setSelectedConversation({
        ...selectedConversation,
        participants: selectedConversation.participants.filter(
          (id) => id !== message.sender._id
        ),
      });
    } catch (error) {
      toast.error("Failed to remove user");
      console.log(error);
    }
  };

  const handleCreateConversation = async () => {
    try {
      const conversationId = await createConversation({
        isGroup: false,
        participants: [me._id, message.sender._id],
      });

      setSelectedConversation({
        _id: conversationId,
        isGroup: false,
        participants: [me._id, message.sender._id],
        name: message.sender.name,
        isOnline: message.sender.isOnline,
        image: message.sender.image,
      });
    } catch (error) {
      toast.error("Failed to create conversation");
    }
  };

  return (
    <div
      className="text-[11px] flex gap-4 justify-between font-bold group cursor-pointer"
      onClick={handleCreateConversation}
    >
      {message.sender.name}
      {isMember && selectedConversation?.admin === me._id && (
        <LogOut
          size={16}
          className="text-red-500 opacity-0 group-hover:opacity-100"
          onClick={handleRemoveUser}
        />
      )}
      {!isMember && <Ban size={16} className="text-red-500" />}
    </div>
  );
};
export default ChatAvatarActions;
