"use client";

import Link from "next/link";

import { useServerContext } from "@/context/serverContext";
import { useSocket } from "@/context/socketContext";
import { getURLFromKey } from "@/lib/s3client";
import styles from "@/styles/button.module.css";

export function OnlineUsers() {
  const { onlineUsers } = useSocket();
  const { username } = useServerContext();

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-text-primary text-lg font-semibold">Online Users</h2>
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

              {user.username === username ? (
                <p className="text-text-primary-light">You</p>
              ) : (
                <Link href={`/chat/dm/${user.username}`}>
                  <button className={styles.smallButton}>Open Chat</button>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
