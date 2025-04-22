"use server";

import { redirect, unauthorized } from "next/navigation";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function createGroup(_: unknown, formData: FormData) {
  const groupName = formData.get("groupName")?.toString();

  if (!groupName) {
    return {
      error: "Group name is required",
    };
  }

  const user = await getUser();

  if (!user) {
    unauthorized();
  }

  const newChat = await prisma.chat.create({
    data: {
      isGroupChat: true,
      name: groupName,
      chatMemberships: {
        create: {
          user: {
            connect: {
              username: user,
            },
          },
        },
      },
    },
  });

  redirect(`/chat/${newChat.id}`);
}
