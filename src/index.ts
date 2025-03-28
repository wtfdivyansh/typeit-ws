import express from "express";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import { UserManager } from "./userManager";
import { RoomManager } from "./roomManager";
import WebSocketManager from "./serverManager";

const app = express();
const server = http.createServer(app);
const wsManager = new WebSocketManager(server);

app.get("/", (req, res) => {
  res.send("WebSocket server is running");
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
