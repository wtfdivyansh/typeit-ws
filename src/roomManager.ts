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
    if(room.memberWs.has(userId)) return;
    room.memberWs.set(userId, ws);
    const prevUsers = this.codeToUsers.get(roomCode) || [];
    // console.log("prevUsers",prevUsers)
    // console.log("user",user)
    this.codeToUsers.set(roomCode, [...new Set(prevUsers), user]);
    console.log("codeToUsers",this.rooms.get(roomCode)?.memberWs.size)
    console.log("codeToUsers",this.codeToUsers.get(roomCode))
  }
  removeRoom(code: string) {
    this.rooms.delete(code);
  }
  getUsersFromCode(code: string): Omit<User, "ws" | "rooms">[] {
    const users = this.codeToUsers.get(code)
    console.log(users?.length)
    if(!users) return []
    return [...new Set(users)]
  }
  broadcast(roomCode: string, message: any) {
    const room = this.getRoom(roomCode);
    if (!room) return;

    room.memberWs.forEach((member) => {
      member.send(JSON.stringify(message));
    });
  }
  disconnectUser(userId: string) {
    this.codeToUsers.forEach((users) => {
      users.splice(users.findIndex((user) => user.id === userId), 1);
    });
  }
}
