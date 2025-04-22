import { redirect, unauthorized } from "next/navigation";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function DMChat({ params }: Props) {
  const currentUsername = await getUser();

  if (!currentUsername) {
    unauthorized();
  }

  const { username } = await params;

  if (username === currentUsername) {
    return (
      <p className="text-red-500">You cannot create chat with yourself!</p>
    );
  }

  const existingRoom = await prisma.chat.findMany({
    where: {
      isGroupChat: false,
      chatMemberships: {
        some: {
          user: {
            username,
          },
        },
      },
      AND: {
        chatMemberships: {
          some: {
            user: {
              username: currentUsername,
            },
          },
        },
      },
    },
  });

  if (existingRoom.length > 0) {
    redirect(`/chat/${existingRoom[0].id}`);
  }

  const newChat = await prisma.chat.create({
    data: {
      isGroupChat: false,
      name: `${currentUsername} and ${username}`,
      chatMemberships: {
        create: [
          {
            user: {
              connect: {
                username,
              },
            },
          },
          {
            user: {
              connect: {
                username: currentUsername,
              },
            },
          },
        ],
      },
    },
  });

  redirect(`/chat/${newChat.id}`);
}
