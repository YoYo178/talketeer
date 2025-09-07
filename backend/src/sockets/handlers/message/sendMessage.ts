import { Message, Room } from "@src/models";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import logger from "@src/utils/logger.utils";

export const getSendMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['sendMessage'] => {
    return async (roomId, messageContent, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to send message');
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

            logger.info(`${socket.data.user.username} sent message in room ${roomId}`, {
                userId: socket.data.user.id,
                roomId,
                messageLength: messageContent.length
            });

            // Broadcast message to everyone in the room (including sender for confirmation)
            io.to(roomId).emit('newMessage', roomId, socket.data.user.id, messageContent, message.toObject());

            ack({ success: true });
        } catch (err) {
            logger.error('Error sending message', {
                userId: socket.data.user.id,
                roomId,
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