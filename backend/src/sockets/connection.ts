import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import { registerGeneralHandlers } from "./handlers/general";
import { registerRoomHandlers } from "./handlers/room";
import { registerMessageHandlers } from "./handlers/message";
import logger from "@src/utils/logger.utils";
import { onlineMembers } from "@src/utils";

export function handleSocketConnection(io: TalketeerSocketServer, socket: TalketeerSocket) {
    if (!socket.data?.user) {
        logger.warn('Unauthenticated user attempted to connect');
        return;
    }

    logger.info(`Client connected: ${socket.data.user.username}`, {
        userId: socket.data.user.id,
        socketId: socket.id
    });

    // Have the user join a room by their own ObjectId for a stable identity
    socket.join(socket.data.user.id);

    onlineMembers.add(socket.data.user.id);

    registerGeneralHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);

    io.emit('memberOnline', onlineMembers.size, socket.data.user.id);
}