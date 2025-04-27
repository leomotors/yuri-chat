"use client";
import React, { useState, ReactNode } from "react";
import { LoginContext } from "./loginContext";

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const refetch = () => {
    const privateKey = localStorage.getItem("privateKey");
    setIsLoggedIn(!!privateKey);
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, refetch }}>
      {children}
    </LoginContext.Provider>
  );
};
