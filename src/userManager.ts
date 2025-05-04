import { User, Room } from "./types";
import WebSocket from "ws";

export class UserManager {
  private users: Map<string, User> 

  constructor() {
    this.users = new Map();
  }

  addUser(user: Omit<User, "ws">, ws: WebSocket ,userId: string) {
    if (this.users.has(userId)) return;
    this.users.set(userId, { ...user, ws, rooms: [] });
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  addUserToRoom(userId: string, room: Room) {
    const user = this.getUser(userId);
    if (!user) return;
    if (!user.rooms.includes(room.id)) {
      user.rooms.push(room.id);
    }
  }

  removeUser(ws:WebSocket) {
    this.users.forEach((user) => {
        if(user.ws === ws){
          this.users.delete(user.id);
        }
    });
    
  }
}
