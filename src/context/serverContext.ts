"use client";

import { useContext } from "react";
import { createContext } from "react";

type ServerContextType = {
  username: string;
};

export const ServerContext = createContext<ServerContextType>({ username: "" });

export const useServerContext = () => useContext(ServerContext);
