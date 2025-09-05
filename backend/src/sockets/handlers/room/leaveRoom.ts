import { leaveRoom } from "@src/services/room.service";
import { AckFunc, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getLeaveRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (roomId: string, ack: AckFunc) => {
        try {
            const userId = socket.data.user.id;

            // Handle database leave process
            await leaveRoom(userId, roomId);

            // Leave the specified room for the client
            socket.leave(roomId);
            console.log(`${socket.data.user.username} left room ${roomId}`);
            ack(true)

            // Broadcast the member leave event to everyone in this room
            io.to(roomId).emit('memberLeft', socket.data.user.id);

            // Let other people (even ones not in the room) refetch the latest room details
            io.emit('roomUpdated', roomId);
        } catch (err) {
            console.error("Error leaving room:", err);
            ack(false, err?.message || 'Unknown error');
        }
    }
}