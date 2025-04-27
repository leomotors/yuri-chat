import { unauthorized } from "next/navigation";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getURLFromKey } from "@/lib/s3client";

import { GroupChat } from "./GroupChat";
import { OnlineUsers } from "./OnlineUsers";

import { LoginProvider } from "@/context/LoginProvider";
import { Logout } from "@/app/Logout";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const username = await getUser();

  if (!username) {
    unauthorized();
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      username,
    },
  });

  const profilePictureURL = getURLFromKey(user.profilePicture);

  return (
    <>
      {/* Header */}
      <Navbar />
      <main className="flex flex-grow flex-col items-center gap-4 p-4">
        <header className="flex w-full items-center justify-start gap-4">
          <img
            src={profilePictureURL}
            alt="pfp"
            className="h-24 w-24 rounded-full"
          />

          <div>
            <p className="text-2xl font-bold">Hello {user.name}!</p>
            <p className="text-xl">Who will you chat with today?</p>
          </div>
        </header>

        <main className="flex flex-col gap-8">
          <OnlineUsers />

          <GroupChat />
        </main>
      </main>
    </>
  );
}
