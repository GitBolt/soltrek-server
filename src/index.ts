import { Socket } from "socket.io";

const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
  autoConnect: false
});

const PORT = process.env.PORT || 3001;

const playgroundSockets: { [playgroundId: string]: Socket[] } = {};

io.on("connection", (socket: Socket) => {
  console.log(`Client ${socket.id} connected`);

  const { playgroundId } = socket.handshake.query;
  console.log("New Playground Id Connection: ", playgroundId)

  socket.join(playgroundId!);

  socket.on("update", (data) => {
    console.log("Received Update From Client: ", playgroundId)
    socket.broadcast.to(playgroundId!).emit("serverUpdate", { nodes: data.nodes, edges: data.edges });
  })

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
    socket.leave(playgroundId as string);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
