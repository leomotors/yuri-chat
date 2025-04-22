import { createServer } from "node:http";

import next from "next";
import { Server } from "socket.io";
import { SocketManager } from "./socket.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  const socketManager = new SocketManager();

  io.on("connection", (socket) => {
    socketManager.addClient(socket);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on ${hostname}:${port}`);
  });
});
