// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { MessageType } from "@prisma/client";

import type prisma from "@/lib/prisma";
import type { allGroupChats, getMessagesWithSender } from "@/lib/query";

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
  "id" | "isGroupChat" | "name" | "createdAt" | "lastMessageSent"
> & {
  chatMemberships: Array<{
    user: PublicUser;
    joinedAt: Date;
  }>;
};

export type MessageWithSender = Awaited<
  ReturnType<typeof getMessagesWithSender>
>[number];

export type MessageWithEncryptionStatus = MessageWithSender & {
  encrypted: boolean;
  failure: boolean;
};

export type ClientSendMessage = {
  content: string;
  messageType: MessageType;
  roomId: string;
};
