"use client";

import { ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { eventNames } from "@/constants";
import { PublicUser } from "@/types";

import { SocketContext } from "./socketContext";

type Props = {
  children: ReactNode;
};

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<PublicUser[]>([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on(eventNames.onlineUsers, (users: PublicUser[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
