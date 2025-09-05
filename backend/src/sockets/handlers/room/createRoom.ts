import { DEFAULT_ROOM_CODE_LENGTH } from "@src/config";
import { createRoom, joinRoom, leaveRoom } from "@src/services/room.service";
import { getUser, isUserInRoom } from "@src/services/user.service";
import { AckFunc, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import { generateRoomCode } from "@src/utils/room.utils";

export const getCreateRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (name: string, visibility: 'public' | 'private', memberLimit: number, ack: AckFunc) => {
        try {
            const userId = socket.data.user.id;
            const user = await getUser(userId);
            if (!user) return;

            const roomId = user.room?.toString();
            if (!roomId) return;
            const userInRoom = await isUserInRoom(userId, roomId);

            if (userInRoom) {
                await leaveRoom(userId, roomId);

                // Leave the specified room for the client
                socket.leave(roomId);
                console.log(`${socket.data.user.username} left room ${roomId}`);

                // Broadcast the member leave event to everyone in this room
                io.to(roomId).emit('memberLeft', userId);

                // Let other people (even ones not in the room) refetch the latest room details
                io.emit('roomUpdated', roomId);
            }

            const newRoom = await createRoom({
                name,
                code: generateRoomCode(DEFAULT_ROOM_CODE_LENGTH),
                memberLimit,
                members: [],
                messages: [],
                isSystemGenerated: false,
                owner: userId,
                visibility
            })

            io.emit('roomCreated', newRoom);

            await joinRoom(userId, newRoom._id.toString());

            // Join the specified room for the client
            socket.join(roomId);
            console.log(`${socket.data.user.username} joined room ${roomId}`);

            // Broadcast the member join event to everyone in this room
            io.to(roomId).emit('memberJoined', socket.data.user.id);

            // Let other people (even ones not in the room) refetch the latest room details
            io.emit('roomUpdated', roomId);

            ack(true);
        } catch (err) {
            console.error("Error creating room:", err);
            ack(false, err?.message || 'Unknown error');
        }
    }
}