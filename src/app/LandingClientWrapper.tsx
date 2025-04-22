"use client";

import { LoginProvider } from "@/context/LoginProvider";
import LandingPage from "./LandingPage";

export default function LandingClientWrapper() {
  return (
    <LoginProvider>
      <LandingPage />
    </LoginProvider>
  );
}
