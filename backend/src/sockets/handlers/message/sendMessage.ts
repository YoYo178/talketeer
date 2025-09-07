import { Message, Room } from "@src/models";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getSendMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['sendMessage'] => {
    return async (roomId, messageContent, ack) => {
        if (!socket.data?.user) {
            console.log('Unauthenticated user');
            return;
        }

        try {
            const room = await Room.findById(roomId);

            if (!room)
                return;

            const message = await Message.create({
                content: messageContent,
                sender: socket.data.user.id
            })

            room.messages.push(message._id.toString());
            await room.save();

            console.log(`${socket.data.user.username} sent message: ${messageContent}`)
            io.to(roomId).emit('newMessage', roomId, socket.data.user.id, messageContent, message.toObject());

            ack({ success: true });
        } catch (err) {
            ack({
                success: true,
                error: err?.message || 'Unknown error'
            });
        }
    }
}