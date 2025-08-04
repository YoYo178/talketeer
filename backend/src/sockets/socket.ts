import { Socket, Server } from "socket.io";
import { handleSocketConnection } from "./connection";

export function setupSocket(io: Server) {
    io.on('connection', (socket: Socket) => handleSocketConnection(io, socket));
}