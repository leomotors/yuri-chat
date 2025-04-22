"use client";

import { ReactNode, useEffect, useState } from "react";
import { SocketContext } from "./socketContext";
import { Socket, io } from "socket.io-client";
import { eventNames } from "@/constants";

type Props = {
  children: ReactNode;
};

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on(eventNames.onlineUsers, (users: string[]) => {
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
