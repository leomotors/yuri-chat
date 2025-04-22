"use client";

import { useMemo } from "react";

import { useSocket } from "@/context/socketContext";
import { getURLFromKey } from "@/lib/s3client";
import { PublicGroupChat } from "@/types";

type Props = {
  roomId: string;
  chatRoom: PublicGroupChat;
};

export function OnlineUsers({ chatRoom }: Props) {
  const { allUsers } = useSocket();

  const onlineUsers = useMemo(() => {
    if (!chatRoom) return [];
    return chatRoom.chatMemberships
      .map((cm) => cm.user)
      .filter((user) =>
        allUsers.some((u) => u.username === user.username && u.online),
      );
  }, [chatRoom, allUsers]);

  return (
    <div className="flex flex-row items-center gap-2">
      <p className="text-text-primary-light">Online Users</p>

      {onlineUsers.map((user) => (
        <img
          key={user.username}
          src={getURLFromKey(user.profilePicture)}
          alt="pfp"
          className="h-6 w-6 rounded-full"
          title={user.name}
        />
      ))}
    </div>
  );
}
