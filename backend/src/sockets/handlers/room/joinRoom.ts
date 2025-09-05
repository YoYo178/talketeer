import { joinRoom } from "@src/services/room.service";
import { AckFunc, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getJoinRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (roomId: string, ack: AckFunc) => {
        try {
            const userId = socket.data.user.id;

            // Handle database join process
            await joinRoom(userId, roomId);

            // Join the specified room for the client
            socket.join(roomId);
            console.log(`${socket.data.user.username} joined room ${roomId}`);

            ack(true);

            // Broadcast the member join event to everyone in this room
            io.to(roomId).emit('memberJoined', userId);

            // Let other people (even ones not in the room) refetch the latest room details
            io.emit('roomUpdated', roomId);
            ack(true);
        } catch (err) {
            console.error("Error joining room:", err);
            ack(false, err?.message || 'Unknown error');
        }
    }
}