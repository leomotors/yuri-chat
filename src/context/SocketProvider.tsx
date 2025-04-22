"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

import { eventNames } from "@/constants";
import {
  PublicGroupChat,
  PublicUser,
  PublicUserWithOnlineStatus,
} from "@/types";

import { SocketContext } from "./socketContext";

type Props = {
  children: ReactNode;
};

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [allUsers, setAllUsers] = useState<PublicUserWithOnlineStatus[]>([]);
  const onlineUsers = useMemo(
    () => allUsers.filter((user) => user.online),
    [allUsers],
  );
  const [allGroupChats, setAllGroupChats] = useState<PublicGroupChat[]>([]);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on(eventNames.allUsers, (users: PublicUserWithOnlineStatus[]) => {
      setAllUsers(users);
    });

    newSocket.on(eventNames.allGroupChats, (groupChats: PublicGroupChat[]) => {
      setAllGroupChats(groupChats);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        allUsers,
        onlineUsers,
        allGroupChats,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
