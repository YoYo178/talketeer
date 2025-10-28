import { TalketeerSocket, TalketeerSocketServer } from "@src/types";
import { registerGeneralHandlers } from "./handlers/general";
import { registerRoomHandlers } from "./handlers/room";
import { registerMessageHandlers } from "./handlers/message";
import logger from "@src/utils/logger.utils";
import { onlineMembers } from "@src/utils";
import { registerFriendHandlers } from "./handlers/friends";
import { DMRoom } from "@src/models";

async function joinDMRooms(socket: TalketeerSocket) {
    const rooms = await DMRoom.find({ members: socket.data.user.id }).select('_id isActive').lean().exec() || [];
    let connectedRooms = 0;

    if (rooms.length) {
        rooms.forEach(room => {
            if (room.isActive) {
                socket.join(room._id.toString());
                connectedRooms++;
            }
        });

        logger.info(`User ${socket.data.user.id} connected to ${connectedRooms}/${rooms.length} DM rooms.`)
    }
}

export function handleSocketConnection(io: TalketeerSocketServer, socket: TalketeerSocket) {
    if (!socket.data?.user) {
        logger.warn('Unauthenticated user attempted to connect');
        return;
    }

    logger.info(`Client connected: ${socket.data.user.id}`, {
        userId: socket.data.user.id,
        socketId: socket.id
    });

    // Have the user join a room by their own ObjectId for a stable identity
    socket.join(socket.data.user.id);

    onlineMembers.add(socket.data.user.id);

    registerFriendHandlers(io, socket);
    registerGeneralHandlers(io, socket);
    registerRoomHandlers(io, socket);
    registerMessageHandlers(io, socket);

    io.emit('userOnline', onlineMembers.size, socket.data.user.id);

    joinDMRooms(socket);
}