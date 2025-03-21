import { User, Room } from "./types";

export class UserManager {
  private users: Map<string, User> = new Map();

  addUser(user: User, ws: WebSocket) {
    if (this.users.has(user.id)) return;
    this.users.set(user.id, { ...user, ws, rooms: [] });
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

  removeUser(id: string) {
    this.users.delete(id);
  }
}
