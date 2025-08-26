import { Room, User } from '@src/models';
import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

export function registerRoomHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('roomJoined', async (userId, roomId, ack) => {
        try {
            const user = await User.findById(userId).select('-passwordHash').lean().exec();
            if (!user) return;

            if (user.room?.toString() === roomId) return;

            // Set user's current room
            await User.updateOne(
                { _id: userId },
                { $set: { room: roomId } }
            );
            const room = await Room.findById(roomId).lean().exec();
            if (!room?.members.some(mem => mem.user.toString() === user._id.toString())) {
                // Add user to the room members
                await Room.updateOne(
                    { _id: roomId },
                    {
                        $push: {
                            members: {
                                user: user._id,
                                roomRole: 'member',
                                joinTimestamp: Date.now()
                            }
                        }
                    }
                );

                // Join the specified room for the client
                socket.join(roomId);
                console.log(`${socket.data.user.username} joined room ${roomId}`);

                ack(true);

                // Broadcast the member join event to everyone in this room
                io.to(roomId).emit('memberJoined', userId, socket.data.user.username);

                // Let other people (even ones not in the room) refetch the latest room details
                io.emit('roomUpdated', roomId);
                ack(true);
            }
        } catch (err) {
            console.error("Error joining room:", err);
            ack(false);
        }
    });

    socket.on('roomLeft', async (userId, roomId, ack) => {
        try {
            const user = await User.findById(userId).select('-passwordHash').lean().exec();
            if (!user) return;

            if (!user.room?.toString()) return;

            // Clear user's current room
            await User.updateOne(
                { _id: userId },
                { $set: { room: null } }
            );

            const room = await Room.findById(roomId).lean().exec();
            if (room?.members.some(mem => mem.user.toString() === user._id.toString())) {
                // Remove user from the room
                await Room.updateOne(
                    { _id: roomId },
                    {
                        $pull: { members: { user: user._id } }
                    }
                );

                // Leave the specified room for the client
                socket.leave(roomId);
                console.log(`${socket.data.user.username} left room ${roomId}`);
                ack(true)

                // Broadcast the member leave event to everyone in this room
                io.to(roomId).emit('memberLeft', userId, socket.data.user.username);

                // Let other people (even ones not in the room) refetch the latest room details
                io.emit('roomUpdated', roomId);
            }
        } catch (err) {
            console.error("Error leaving room:", err);
            ack(false)
        }
    });
}