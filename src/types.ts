export type User = {
    id:string,
    name:string,
    avatar:string
    ws:WebSocket
    rooms:string[]
}

export type Room = {
    id:string,
    code:string,
    members:string[]
}