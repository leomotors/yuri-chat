import { parse } from "cookie";
import { jwtVerify } from "jose";
import { Socket } from "socket.io";

import { authCookieName, eventNames } from "@/constants";
import { environment } from "@/lib/environment";
import prisma from "@/lib/prisma";
import { allGroupChats } from "@/lib/query";
import {
  ClientSendMessage,
  GroupChatFull,
  MessageWithSender,
  PublicGroupChat,
  PublicUserWithOnlineStatus,
  User,
} from "@/types";

class SocketClient {
  constructor(
    public readonly socket: Socket,
    public readonly username: string,
  ) {}
}

class UserDatabase {
  private _users: User[] = [];

  public get users() {
    return this._users;
  }

  constructor() {
    this.refresh();
  }

  private async refresh() {
    this._users = await prisma.user.findMany();
  }

  public async getUsersSafe(usernames: string[]) {
    if (
      usernames.some((u) => !this.users.some((user) => user.username === u))
    ) {
      await this.refresh();
    }

    return this.users;
  }
}

class ChatDatabase {
  private _groupChats: GroupChatFull[] = [];

  public get groupChats() {
    return this._groupChats;
  }

  constructor() {
    this.refresh();
  }

  public async refresh() {
    this._groupChats = await allGroupChats();
  }

  public getPublicGroupChats() {
    return this.groupChats
      .filter((chat) => chat.isGroupChat)
      .map((chat) => ({
        id: chat.id,
        name: chat.name,
        createdAt: chat.createdAt,
        isGroupChat: chat.isGroupChat,
        lastMessageSent: chat.lastMessageSent,
        chatMemberships: chat.chatMemberships.map((membership) => ({
          user: {
            username: membership.user.username,
            name: membership.user.name,
            profilePicture: membership.user.profilePicture,
            publicKey: membership.user.publicKey,
          },
          joinedAt: membership.joinedAt,
        })),
      })) satisfies PublicGroupChat[];
  }
}

export class SocketManager {
  private clients: Record<string, SocketClient> = {};
  private userDatabase: UserDatabase = new UserDatabase();
  private chatDatabase: ChatDatabase = new ChatDatabase();

  constructor() {}

  public async addClient(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const token = cookie ? parse(cookie)[authCookieName] : null;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(environment.JWT_SECRET),
        {
          algorithms: ["HS256"],
        },
      );

      const username = payload.username as string;

      console.log(`${username} connected`);

      this.clients[socket.id] = new SocketClient(socket, username);
      this.broadcastOnlineUsers();

      // Give neccessary info to users
      socket.emit(
        eventNames.allGroupChats,
        this.chatDatabase.getPublicGroupChats(),
      );

      socket.on(eventNames.requestRefreshGroupChats, async () => {
        await this.chatDatabase.refresh();
        this.broadcastAllGroupChats();
      });

      socket.on(eventNames.sendMessage, async (message: ClientSendMessage) => {
        // todo security check if user can send message

        const newMessage = await prisma.message.create({
          data: {
            sender: {
              connect: {
                username: username,
              },
            },
            chat: {
              connect: {
                id: message.roomId,
              },
            },
            content: message.content,
            contentType: message.messageType,
          },
        });

        const allReceivers = await prisma.chatMembership.findMany({
          where: {
            chatId: message.roomId,
          },
          select: {
            user: {
              select: {
                username: true,
              },
            },
          },
        });

        const receivers = allReceivers.map((r) => r.user.username);

        const user = await prisma.user.findUniqueOrThrow({
          where: {
            username: username,
          },
          select: {
            id: true,
            username: true,
            name: true,
            profilePicture: true,
            publicKey: true,
          },
        });

        for (const client of Object.values(this.clients)) {
          if (receivers.includes(client.username)) {
            client.socket.emit(eventNames.newMessage, {
              ...newMessage,
              sender: user,
            } satisfies MessageWithSender);
          }
        }
      });

      socket.on("disconnect", () => {
        console.log(`${username} disconnected`);
        delete this.clients[socket.id];
        this.broadcastOnlineUsers();
      });
    } catch (_) {
      socket.disconnect();
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private emitAll(event: string, ...args: any[]) {
    for (const client of Object.values(this.clients)) {
      client.socket.emit(event, ...args);
    }
  }

  private async broadcastOnlineUsers() {
    const onlineUsers = new Set(
      Object.values(this.clients).map((c) => c.username),
    );

    const allUsers = (
      await this.userDatabase.getUsersSafe([...onlineUsers])
    ).map((user) => ({
      username: user.username,
      name: user.name,
      profilePicture: user.profilePicture,
      publicKey: user.publicKey,
      online: onlineUsers.has(user.username),
    })) satisfies PublicUserWithOnlineStatus[];

    this.emitAll(eventNames.allUsers, allUsers);
  }

  private async broadcastAllGroupChats() {
    const allGroupChats = this.chatDatabase.getPublicGroupChats();

    this.emitAll(eventNames.allGroupChats, allGroupChats);
  }
}
