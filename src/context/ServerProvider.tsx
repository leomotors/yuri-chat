"use client";

import { ReactNode } from "react";

import { ServerContext } from "./serverContext";

type Props = {
  children: ReactNode;
  username: string;
};

export function ServerProvider({ children, username }: Props) {
  return (
    <ServerContext.Provider value={{ username }}>
      {children}
    </ServerContext.Provider>
  );
}
