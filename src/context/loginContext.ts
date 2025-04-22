"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface LoginContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  refetch: () => void;
}

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {
    throw new Error("setIsLoggedIn must be used within a LoginProvider");
  },
  refetch: () => {
    throw new Error("refetch must be used within a LoginProvider");
  },
});

export const useLoginContext = () => {
  return useContext(LoginContext);
};
