import { Message, Room } from "@src/models";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types";
import { sendMessageSchema } from "@src/schemas";
import logger from "@src/utils/logger.utils";

export const getSendMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['sendMessage'] => {
    return async (roomId, messageContent, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to send message');
            return;
        }

        try {
            // TODO: temporary!!
            // Validate input
            const validationResult = sendMessageSchema.safeParse({ roomId, message: messageContent });
            if (!validationResult.success)
                throw new Error('Invalid input data');

            const room = await Room.findById(roomId);

            if (!room)
                throw new Error('Room not found');

            const message = await Message.create({
                content: messageContent,
                sender: socket.data.user.id,
                room: roomId
            })

            room.messages.push(message._id);
            await room.save();

            logger.info(`${socket.data.user.username} sent message in room ${roomId}`, {
                userId: socket.data.user.id,
                roomId,
                messageLength: messageContent.length
            });

            // Broadcast message to everyone in the room (including sender for confirmation)
            io.to(roomId).emit('newMessage', roomId, socket.data.user.id, message.toObject());

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