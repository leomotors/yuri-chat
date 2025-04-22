"use client";

import { useSocket } from "@/context/socketContext";

export function OnlineUsers() {
  const { onlineUsers } = useSocket();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Online Users</h2>
      <ul className="list-disc pl-5">
        {onlineUsers.map((user) => (
          <li key={user} className="text-gray-700">
            {user}
          </li>
        ))}
      </ul>
    </div>
  );
}
