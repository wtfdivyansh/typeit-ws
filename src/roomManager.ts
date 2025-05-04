import {  Message, Room, User } from "./types";
import WebSocket from "ws";
export class RoomManager {
  private rooms: Map<string, Room> 
  private codeToUsers: Map<string, User[]>



  constructor() {
    this.rooms = new Map();
    this.codeToUsers = new Map();
  }

  addRoom(room: Omit<Room, "members">, code: string,hostId:string): Room {
    if (this.rooms.has(code)) {
      return this.rooms.get(code)!;
    }

    const newRoom: Room = { ...room, memberWs: new Map(),messages: [],host:hostId };
    this.codeToUsers.set(code, []);
    this.rooms.set(code, newRoom);
    return newRoom;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  addMember(roomCode:string, userId: string, ws: WebSocket,user: User) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    if(room.memberWs.has(userId)) return;
    room.memberWs.set(userId, ws);
    const prevUsers = this.codeToUsers.get(roomCode) || [];
    this.codeToUsers.set(roomCode, [...new Set(prevUsers), ...[{...user,ws}]]);

  }
  removeMember(ws:WebSocket) {
    this.rooms.forEach((room) => {
      room.memberWs.forEach((member,id) => {
        if(member === ws){
          room.memberWs.delete(id);
        }
      });
    });
    this.codeToUsers.forEach((users) => {
      users.splice(users.findIndex((user) => user.ws === ws), 1);
    });
 
  }
  removeRoom(code: string) {
    this.rooms.delete(code);
  }
  getUsersFromCode(code: string): Omit<User, "ws" | "rooms">[] {
    const users = this.codeToUsers.get(code)
    console.log("ROOM USERS LENGTH : ",users?.length)
    if(!users) return []
    return [...new Set(users)]
  }
  broadcast(roomCode: string, message: any,) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    console.log("ROOM WS : ",message)
    room.memberWs.forEach((member,id) => {
      console.log("sending Message:", id)
      member.send(JSON.stringify(message));
    });
  }
  disconnectUser(userId: string) {
    this.codeToUsers.forEach((users) => {
      users.splice(users.findIndex((user) => user.id === userId), 1);
    });
  }
  addMessage(roomCode: string, message: Message ) {
    const room = this.getRoom(roomCode);
    if (!room) return;
    room.messages.push(message);
  }

}
