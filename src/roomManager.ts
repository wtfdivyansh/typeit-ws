import { Room, User } from "./types";

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  addRoom(room: Room, code: string): Room {
    if (this.rooms.has(code)) {
      return this.rooms.get(code)!;
    }

    const newRoom: Room = { ...room, members: [] };
    this.rooms.set(code, newRoom);
    return newRoom;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  addMember(roomCode:string, user: User) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    room.members.push(user.id);
  }
  removeRoom(code: string) {
    this.rooms.delete(code);
  }
}
