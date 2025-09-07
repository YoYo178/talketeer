import { getRoomByCode, joinRoom } from "@src/services/room.service";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import logger from "@src/utils/logger.utils";

export const getJoinRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['joinRoom'] => {
    return async ({ method, data }, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to join room');
            return;
        }
        
        try {
            const userId = socket.data.user.id;
            let roomId: string | null = null;

            switch (method) {
                case "id":
                    roomId = data;
                    break;

                case "code":
                    const roomByCode = await getRoomByCode(data);
                    if (!roomByCode) throw new Error("Room not found");
                    roomId = roomByCode._id.toString();
                    break;

                default:
                    throw new Error('Unknown join method');
            }

            if (!roomId)
                throw new Error('Room ID not found');

            // Handle database join process
            await joinRoom(userId, roomId);

            // Join the specified room for the client
            socket.join(roomId);
            logger.info(`${socket.data.user.username} joined room ${roomId}`, {
                userId: socket.data.user.id,
                roomId,
                method
            });

            // Broadcast the member join event to everyone in this room
            io.to(roomId).emit('memberJoined', userId);

            // Let other people (even ones not in the room) refetch the latest room details
            io.emit('roomUpdated', roomId);
            ack({ success: true, data: roomId });
        } catch (err) {
            logger.error("Error joining room", {
                userId: socket.data.user.id,
                method,
                data,
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