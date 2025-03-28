import WebSocket from "ws";

export type User = {
    id:string
  name: string;
  image: string;
  ws: WebSocket;
  rooms: string[];
};

export type Room = {
  id: string;
  memberWs: Map<string, WebSocket>;
};

export type ReqEvents =
  | "USER_JOIN"
  | "USER_LEAVE "
  | "USER_PROGRESS"
  | "RACE_END"
  | "USER_DISCONNECT"
  | "RACE_START";
export type ResEvents =
  | "USER_JOINED"
  | "USER_LEFT"
  | "USER_PROGRESS"
  | "RACE_END"
  | "USER_DISCONNECTED"
  | "RACE_STARTED";

export type Payload = {
  type: ReqEvents;
  userId: string;
  roomCode: string;
  user: {
    name: string;
    image: string;
  };
  room: {
    id: string;
  };
  stats: {
    wpm: number;
    accuracy: number;
  };
};
