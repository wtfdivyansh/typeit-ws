import { Room, User } from "./types";
import WebSocket from "ws";
export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private codeToUsers: Map<string, Omit<User, "ws">[]> = new Map();

  addRoom(room: Omit<Room, "members">, code: string): Room {
    if (this.rooms.has(code)) {
      return this.rooms.get(code)!;
    }

    const newRoom: Room = { ...room, memberWs: new Map() };
    this.codeToUsers.set(code, []);
    this.rooms.set(code, newRoom);
    return newRoom;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  addMember(roomCode:string, userId: string, ws: WebSocket,user: Omit<User, "ws">) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    room.memberWs.set(userId, ws);
    this.codeToUsers.set(roomCode, [...this.codeToUsers.get(roomCode)!, user]);
  }
  removeRoom(code: string) {
    this.rooms.delete(code);
  }
  getUsersFromCode(code: string): Omit<User, "ws">[] {
    return this.codeToUsers.get(code) || [];
  }
  broadcast(roomCode: string, message: any) {
    const room = this.getRoom(roomCode);
    if (!room) return;

    room.memberWs.forEach((member) => {
      member.send(JSON.stringify(message));
    });
  }
}
