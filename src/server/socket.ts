import { Socket } from "socket.io";
import { parse } from "cookie";
import { authCookieName, eventNames } from "@/constants";
import { jwtVerify } from "jose";
import { environment } from "@/lib/environment";

class SocketClient {
  constructor(
    public readonly socket: Socket,
    public readonly username: string,
  ) {}
}

export class SocketManager {
  private clients: Record<string, SocketClient> = {};

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
    } catch (error) {
      socket.disconnect();
      return;
    }
  }

  private emitAll(event: string, ...args: any[]) {
    for (const client of Object.values(this.clients)) {
      client.socket.emit(event, ...args);
    }
  }

  private broadcastOnlineUsers() {
    const onlineUsers = Object.values(this.clients).map((c) => c.username);

    this.emitAll(eventNames.onlineUsers, onlineUsers);
  }
}
