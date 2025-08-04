import { Socket, Server } from "socket.io";
import { handleSocketConnection } from "./connection";
import { requireSocketAuth } from "@src/middlewares";

export function setupSocket(io: Server) {
    io.use(requireSocketAuth);
    io.on('connection', (socket: Socket) => handleSocketConnection(io, socket));
}