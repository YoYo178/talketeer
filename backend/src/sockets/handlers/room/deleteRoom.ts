import { deleteRoom, leaveRoom, isUserRoomOwner, getRoom } from "@src/services/room.service";
import { getUser } from "@src/services/user.service";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import { roomIdParamsSchema } from "@src/schemas";
import logger from "@src/utils/logger.utils";

export const getDeleteRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['deleteRoom'] => {
    return async (roomId, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to delete room');
            return;
        }

        try {
            // TODO: temporary!!
            // Validate input
            const validationResult = roomIdParamsSchema.safeParse({ roomId });
            if (!validationResult.success)
                throw new Error('Invalid input data');

            const room = await getRoom(roomId);
            if (!room)
                throw new Error('Room not found');

            if (room.isSystemGenerated)
                throw new Error('System rooms cannot be deleted');

            const userId = socket.data.user.id;
            const user = await getUser(userId);
            if (!user)
                throw new Error('User not found');

            const isOwner = isUserRoomOwner(userId, roomId);
            if (!isOwner)
                throw new Error('You are not the owner of this room');

            // Leave room for admin
            await leaveRoom(userId, roomId);

            // Leave the specified room for the client
            socket.leave(roomId);
            logger.info(`${socket.data.user.username} left room ${roomId} due to room deletion.`, {
                userId: socket.data.user.id,
                roomId
            });

            logger.info(`${socket.data.user.username} initiated room deletion, disconnecting ${io.sockets.adapter.rooms.get(roomId)?.size || 0} client(s) from this room...`, {
                userId: socket.data.user.id,
                roomId
            });

            // Leave room for everyone else
            await Promise.all(room.members.map(mem => leaveRoom(mem.user.toString(), roomId)));

            // Emit event before kicking clients
            io.emit('roomDeleted', roomId);

            // Kick all clients
            io.in(roomId).socketsLeave(roomId);

            await deleteRoom(roomId);

            // TODO: delete all associated messages

            ack({ success: true });
        } catch (err) {
            logger.error("Error deleting room", {
                userId: socket.data.user.id,
                error: err?.message || 'Unknown error',
                stack: err instanceof Error ? err.stack : undefined
            });
            ack({
                success: false,
                error: err?.message || 'Unknown error'
            });
        }
    }
}