import { leaveRoom } from "@src/services/room.service";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getLeaveRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['leaveRoom'] => {
    return async (roomId, ack) => {
        try {
            const userId = socket.data.user.id;

            // Handle database leave process
            await leaveRoom(userId, roomId);

            // Leave the specified room for the client
            socket.leave(roomId);
            console.log(`${socket.data.user.username} left room ${roomId}`);

            // Broadcast the member leave event to everyone in this room
            io.to(roomId).emit('memberLeft', socket.data.user.id);

            // Let other people (even ones not in the room) refetch the latest room details
            io.emit('roomUpdated', roomId);

            ack({ success: true })
        } catch (err) {
            console.error("Error leaving room:", err);
            ack({
                success: false,
                error: err?.message || 'Unknown error'
            });
        }
    }
}