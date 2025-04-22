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
