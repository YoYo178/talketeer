import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import { registerSocketHandlers } from "./handlers/socket.handlers";

export function handleSocketConnection(io: TalketeerSocketServer, socket: TalketeerSocket) {
    console.log(`Client connected: ${socket.data.user.username}`);

    // Have the user join a room by their own ObjectId for a stable identity
    socket.join(socket.data.user.id);

    registerSocketHandlers(io, socket);
}