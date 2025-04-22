"use client";

import Link from "next/link";
import FallingFlowers from "@/components/FallingFlowers";
import { useLoginContext } from "@/context/loginContext";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LandingPage() {
  const searchParams = useSearchParams();
  const refresh = searchParams.get("refresh");
  const { isLoggedIn, setIsLoggedIn, refetch } = useLoginContext();

  useEffect(() => {
    refetch();
  }, [refresh]);

  return (
    <main className="flex flex-grow flex-col items-center justify-center gap-4 px-4">
      <FallingFlowers />
      <h1 className="text-text-primary-light text-6xl font-bold">Yuri Chat</h1>
      <p className="text-2xl">Chat App for ท่านผู้เจริญ</p>

      {!isLoggedIn ? (
        <div className="flex gap-4">
          <button className="rounded-xl bg-pink-600 px-4 py-2 text-xl text-pink-100">
            <Link href="/login">Login</Link>
          </button>
          <button className="rounded-xl bg-pink-200 px-4 py-2 text-xl text-pink-600">
            <Link href="/register">Register</Link>
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button className="rounded-xl bg-pink-600 px-4 py-2 text-xl text-pink-100">
            <Link href="/home">Chat Now!</Link>
          </button>
        </div>
      )}
    </main>
  );
}
