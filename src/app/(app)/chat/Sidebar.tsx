"use client";

import Link from "next/link";

import { useServerContext } from "@/context/serverContext";
import { useSocket } from "@/context/socketContext";
import { getURLFromKey } from "@/lib/s3client";

export function ChatSidebar() {
  const { allUsers, allGroupChats } = useSocket();
  const { username } = useServerContext();

  return (
    <aside className="bg-foreground flex flex-col gap-4 p-4">
      <h2 className="text-text-primary text-xl font-bold">Private Messages</h2>
      <div className="flex flex-col gap-2">
        {allUsers.map((user) => {
          if (user.username === username) return null;

          return (
            <Link
              href={`/chat/dm/${user.username}`}
              key={user.username}
              className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-md"
            >
              <img
                src={getURLFromKey(user.profilePicture)}
                alt="pfp"
                className="h-8 w-8 rounded-full"
              />
              <p className="text-text-primary-light">{user.name}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="text-text-primary text-xl font-bold">Group Chats</h2>
      <div className="flex flex-col gap-2">
        {allGroupChats.map((gc) => (
          <Link
            key={gc.id}
            className="flex flex-col items-center gap-1 rounded-lg bg-white p-2 shadow-md"
            href={`/chat/${gc.id}`}
          >
            <p className="text-text-primary-light">{gc.name}</p>

            <div className="flex justify-start">
              {gc.chatMemberships.map((cm) => (
                <img
                  key={cm.user.username}
                  src={getURLFromKey(cm.user.profilePicture)}
                  alt="pfp"
                  className="h-4 w-4 rounded-full"
                />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
