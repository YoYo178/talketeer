import { TalketeerSocket, TalketeerSocketServer } from "@src/types";
import { registerSocketHandlers } from "./handlers/socket.handlers";

export function handleSocketConnection(io: TalketeerSocketServer, socket: TalketeerSocket) {
    console.log(`Client connected: ${socket.id}`);
    registerSocketHandlers(io, socket);
}