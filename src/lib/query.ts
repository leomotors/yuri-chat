import prisma from "./prisma";

export async function allGroupChats() {
  return await prisma.chat.findMany({
    include: {
      chatMemberships: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function getMessagesWithSender(chatRoomId: string) {
  return await prisma.message.findMany({
    where: {
      chatId: chatRoomId,
    },
    include: {
      sender: {
        select: {
          username: true,
          name: true,
          profilePicture: true,
          publicKey: true,
        },
      },
    },
  });
}
