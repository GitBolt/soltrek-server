import { Socket } from "socket.io";

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
  autoConnect: false
});

const PORT = process.env.PORT || 3001;

io.on("connection", (socket: Socket) => {
  console.log(`Client ${socket.id} connected`);

  const { playgroundId } = socket.handshake.query;

  socket.join(playgroundId!);

  socket.on("update", (playground) => {
    socket.broadcast.to(playgroundId!).emit("serverUpdate", { ...playground });
  })

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    socket.leave(playgroundId as string);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
