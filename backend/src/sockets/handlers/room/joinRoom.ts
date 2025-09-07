import { getRoomByCode, joinRoom } from "@src/services/room.service";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getJoinRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['joinRoom'] => {
    return async ({ method, data }, ack) => {
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
            console.log(`${socket.data.user.username} joined room ${roomId}`);

            // Broadcast the member join event to everyone in this room
            io.to(roomId).emit('memberJoined', userId);

            // Let other people (even ones not in the room) refetch the latest room details
            io.emit('roomUpdated', roomId);
            ack({ success: true, data: roomId });
        } catch (err) {
            console.error("Error joining room:", err);
            ack({
                success: false,
                error: err?.message || 'Unknown error'
            });
        }
    }
}