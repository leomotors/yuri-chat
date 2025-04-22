import type prisma from "@/lib/prisma";
import { allGroupChats } from "@/lib/query";

export type User = Awaited<ReturnType<typeof prisma.user.findMany>>[number];

export type PublicUser = Pick<
  User,
  "username" | "name" | "profilePicture" | "publicKey"
>;
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
