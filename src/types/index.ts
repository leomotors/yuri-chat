import type prisma from "@/lib/prisma";
import { allGroupChats } from "@/lib/query";
import { Prisma, User } from "@prisma/client";

export type PublicUser = Pick<User, "username" | "name" | "profilePicture">;
export type PublicUserWithOnlineStatus = PublicUser & {
  online: boolean;
};

export type Chat = Awaited<ReturnType<typeof prisma.chat.findMany>>[number];

export type GroupChatFull = Awaited<ReturnType<typeof allGroupChats>>[number];

export type PublicGroupChat = Pick<
  Chat,
  "id" | "name" | "createdAt" | "lastMessageSent"
> & {
  chatMemberships: Array<{
    user: PublicUser;
    joinedAt: Date;
  }>;
};
