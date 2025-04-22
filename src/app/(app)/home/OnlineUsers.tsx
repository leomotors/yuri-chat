"use client";

import { useSocket } from "@/context/socketContext";
import { getURLFromKey } from "@/lib/s3client";

export function OnlineUsers() {
  const { onlineUsers } = useSocket();

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-lg font-semibold">Online Users</h2>
      <ul className="flex gap-2">
        {onlineUsers.map((user) => (
          <li key={user.username}>
            <div className="bg-foreground flex flex-col items-center gap-4 rounded-xl p-4">
              <img
                src={getURLFromKey(user.profilePicture)}
                alt="pfp"
                className="h-24 w-24 rounded-full"
              />

              <div className="flex flex-col items-center gap-1">
                <p className="text-text-primary font-bold">{user.name}</p>
                <p className="text-text-primary-light">{user.username}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
