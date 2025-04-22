"use client";

import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  onlineUsers: string[];
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const useSocket = () => useContext(SocketContext);
