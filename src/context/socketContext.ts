"use client";

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

import { PublicUser } from "@/types";

type SocketContextType = {
  socket: Socket | null;
  onlineUsers: PublicUser[];
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);
