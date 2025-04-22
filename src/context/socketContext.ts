"use client";

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

import { PublicGroupChat, PublicUserWithOnlineStatus } from "@/types";

type SocketContextType = {
  socket: Socket | null;
  allUsers: PublicUserWithOnlineStatus[];
  onlineUsers: PublicUserWithOnlineStatus[];
  allGroupChats: PublicGroupChat[];
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  allUsers: [],
  onlineUsers: [],
  allGroupChats: [],
});

export const useSocket = () => useContext(SocketContext);
