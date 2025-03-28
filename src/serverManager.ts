import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { UserManager } from "./userManager";
import { RoomManager } from "./roomManager";

class WebSocketManager {
  private wss: WebSocketServer;
  private users: UserManager;
  private rooms: RoomManager;
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.users = new UserManager();
    this.rooms = new RoomManager();
    this.setupWebSocket();
  }
  setupWebSocket() {
    this.wss.on("connection", (ws) => {
      console.log("Client connected");

      ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        const data = JSON.parse(message.toString());
        console.log(data.data.user);

        if (!this.users.getUser(data.userId)) {
          this.users.addUser(
            {
              id: data.data.userId,
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
            this.handleUserJoin(data, ws);
            break;
          case "ROOM_MESSAGE":
            this.handleRoomMessage(data, ws);
            break;
        }
      });

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });
  }
  private handleUserJoin(data: any, ws: WebSocket) {
    const room = this.rooms.addRoom(data.data.room, data.data.roomCode);
    this.users.addUserToRoom(data.data.userId, room);

    this.rooms.addMember(
      data.data.roomCode,
      data.data.userId,
      ws,
      data.data.user
    );

    const prevUsers = this.rooms.getUsersFromCode(data.data.roomCode);
    console.log(prevUsers);

    this.rooms.broadcast(data.data.roomCode, {
      type: "USER_JOINED",
      users:
        prevUsers.length > 0
          ? prevUsers.map((user) => ({
              id: user.id,
              name: user.name,
              image: user.image,
              stats: {
                wpm: 0,
                accuracy: 0,
              },
            }))
          : [],
      stats: {
        wpm: 0,
        accuracy: 0,
      },
    });
  }
  private handleRoomMessage(data: any, ws: WebSocket) {
    const { roomCode, message } = data.data;
    this.rooms.addMessage(roomCode, message);
    this.rooms.broadcast(roomCode, {
      type: "ROOM_MESSAGE",
      message: message,
    });
    return;
  }
}

export default WebSocketManager;
