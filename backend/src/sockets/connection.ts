import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import { registerGeneralHandlers } from "./handlers/general";
import { registerRoomHandlers } from "./handlers/room";
import { registerMessageHandlers } from "./handlers/message";

export function handleSocketConnection(io: TalketeerSocketServer, socket: TalketeerSocket) {
    if (!socket.data?.user) {
        console.log('Unauthenticated user');
        return;
    }

    console.log(`Client connected: ${socket.data.user.username}`);

    // Have the user join a room by their own ObjectId for a stable identity
    socket.join(socket.data.user.id);

    registerGeneralHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);
}