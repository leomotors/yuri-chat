import { User } from "@prisma/client";
import { parse } from "cookie";
import { jwtVerify } from "jose";
import { Socket } from "socket.io";

import { authCookieName, eventNames } from "@/constants";
import { environment } from "@/lib/environment";
import prisma from "@/lib/prisma";
import { PublicUser } from "@/types";

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

export class SocketManager {
  private clients: Record<string, SocketClient> = {};
  private userDatabase: UserDatabase = new UserDatabase();

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

    const allUsers = (await this.userDatabase.getUsersSafe([...onlineUsers]))
      .filter((user) => onlineUsers.has(user.username))
      .map((user) => ({
        username: user.username,
        name: user.name,
        profilePicture: user.profilePicture,
      })) satisfies PublicUser[];

    this.emitAll(eventNames.onlineUsers, allUsers);
  }
}
