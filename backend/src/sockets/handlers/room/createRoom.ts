import { DEFAULT_ROOM_CODE_LENGTH } from "@src/config";
import { createRoom, joinRoom, leaveRoom, isUserInRoom } from "@src/services/room.service";
import { getUser } from "@src/services/user.service";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types";
import { generateRoomCode } from "@src/utils";
import { createRoomSchema } from "@src/schemas";
import logger from "@src/utils/logger.utils";
import mongoose from "mongoose";

export const getCreateRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['createRoom'] => {
    return async (name, visibility, memberLimit, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to create room');
            return;
        }

        try {
            // Validate input
            createRoomSchema.parse({ name, visibility, memberLimit });

            const userId = socket.data.user.id;
            const user = await getUser(userId);
            if (!user)
                throw new Error('User not found');

            if (user.room?.toString()) {
                const roomId = user.room.toString();
                const userInRoom = await isUserInRoom(roomId, userId);

                if (userInRoom) {
                    await leaveRoom(userId, roomId);

                    // Leave the specified room for the client
                    socket.leave(roomId);
                    logger.info(`${socket.data.user.id} left room ${roomId} to create new room`, {
                        userId: socket.data.user.id,
                        oldRoomId: roomId
                    });

                    // Broadcast the member leave event to everyone in this room
                    socket.to(roomId).emit('memberLeft', roomId, userId);

                    // Let other people (even ones not in the room) refetch the latest room details
                    socket.broadcast.emit('roomUpdated', roomId);
                }
            }

            const newRoom = await createRoom({
                name,
                code: generateRoomCode(DEFAULT_ROOM_CODE_LENGTH),
                memberLimit,
                members: [],
                messages: [],
                isSystemGenerated: false,
                owner: new mongoose.Types.ObjectId(userId),
                visibility
            })
            const roomId = newRoom._id.toString();

            // Broadcast room creation to all users (they need to see new rooms)
            socket.broadcast.emit('roomCreated', newRoom);

            await joinRoom(userId, roomId, true);

            // Join the specified room for the client
            socket.join(roomId);
            logger.info(`${socket.data.user.id} created and joined room ${roomId}`, {
                userId: socket.data.user.id,
                roomId,
                roomData: { name, visibility, memberLimit }
            });

            // Broadcast the member join event to everyone in this room (except the joiner)
            socket.to(roomId).emit('memberJoined', roomId, socket.data.user.id);

            // Let other people (even ones not in the room) refetch the latest room details
            socket.broadcast.emit('roomUpdated', roomId);

            ack({ success: true, data: newRoom });
        } catch (err) {
            logger.error("Error creating room", {
                userId: socket.data.user.id,
                roomData: { name, visibility, memberLimit },
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