import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import { RoomManager } from "./roomManager";
import { Payload } from "./types";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

const users = new UserManager();
const rooms = new RoomManager();
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    const data = JSON.parse(message.toString())
    console.log(data.data.user);
    if (!users.getUser(data.userId)) {
      users.addUser(
        {
          name: data.data.user.name,
          image: data.data.user.image,
          rooms: [],
        },
        ws,
        data.data.userId
      );
    }
    switch (data.type) {
      case "USER_JOIN":
        const room = rooms.addRoom(data.data.room, data.data.roomCode);
        users.addUserToRoom(data.data.userId, room);
        rooms.addMember(data.data.roomCode, data.data.userId, ws,data.user);
        const prevUsers = rooms.getUsersFromCode(data.data.roomCode);
        rooms.broadcast(data.data.roomCode, {
          type: "USER_JOINED",
          user: {
            id: data.data.userId,
            name: data.data.user.name,
            image: data.data.user.image,
          },
          users: prevUsers,
          stats: {
            wpm: 0,
            accuracy: 0,
          },
        });
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
