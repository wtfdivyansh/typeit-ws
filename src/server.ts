import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import { RoomManager } from "./roomManager";

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
    const data = JSON.parse(message.toString());
    if(!users.getUser(data.userId)) {
     users.addUser(data.user, data.user.ws)
    }
    switch (data.type) {
      case "join":
        const room = rooms.addRoom(data.room, data.roomCode);
        users.addUserToRoom(data.userId, room);
        rooms.addMember(data.roomCode, data.user);
        ws.send(JSON.stringify({ type: "join",room: room }));
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
