import { forbidden, notFound, unauthorized } from "next/navigation";

import { getUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { Updater } from "./Updater";
import { ChatWindow } from "./ChatWindow";
import { getMessagesWithSender } from "@/lib/query";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Chat({ params }: Props) {
  const username = await getUser();

  if (!username) {
    unauthorized();
  }

  const { id } = await params;

  const chatRoom = await prisma.chat.findUnique({
    where: {
      id,
    },
    include: {
      chatMemberships: {
        include: {
          user: {
            select: {
              username: true,
              name: true,
              profilePicture: true,
              publicKey: true,
            },
          },
        },
      },
    },
  });

  if (!chatRoom) {
    notFound();
  }

  if (!chatRoom.isGroupChat) {
    if (!chatRoom.chatMemberships.some((cm) => cm.user.username === username)) {
      forbidden();
    }
  }

  const isMember = chatRoom.chatMemberships.some(
    (cm) => cm.user.username === username,
  );

  if (!isMember) {
    // I should have use username as id
    const user = await prisma.user.findUniqueOrThrow({
      where: { username },
    });

    await prisma.chatMembership.create({
      data: {
        chatId: chatRoom.id,
        userId: user.id,
      },
    });
  }

  const initialMessages = await getMessagesWithSender(chatRoom.id);

  return (
    <div className="flex flex-grow flex-col gap-4 p-4">
      <h1 className="text-text-primary space-x-2 text-2xl font-bold">
        {chatRoom.isGroupChat ? (
          <span className="rounded bg-blue-500 px-2 py-1 text-base text-white">
            GC
          </span>
        ) : (
          <span className="rounded bg-green-500 px-2 py-1 text-base text-white">
            DM
          </span>
        )}
        <span>{chatRoom.name}</span>
      </h1>
      <p className="text-text-primary-light">Chat with {id}</p>

      {chatRoom.isGroupChat && <Updater />}

      <ChatWindow
        roomId={id}
        initialMessages={initialMessages}
        chatRoom={chatRoom}
      />
    </div>
  );
}
