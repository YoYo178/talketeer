import { DMRoom, Message, Room } from "@src/models";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types";
import { sendMessageSchema } from "@src/schemas";
import logger from "@src/utils/logger.utils";

export const getSendMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['sendMessage'] => {
    return async (isDM, roomId, messageContent, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to send message');
            return;
        }

        try {
            // Validate input
            sendMessageSchema.parse({ isDM, roomId, message: messageContent });

            const room = isDM ? await DMRoom.findById(roomId) : await Room.findById(roomId);

            if (!room)
                throw new Error('Room not found');

            // just typescript being typescript
            // @ts-ignore
            if (isDM && !room.isActive)
                throw new Error('This person is not on your friend list.');

            const message = await Message.create({
                content: messageContent,
                sender: socket.data.user.id,
                room: roomId
            })

            if (isDM) {
                await DMRoom.findOneAndUpdate(
                    { _id: roomId },
                    { $addToSet: { messages: message._id } }
                )
            } else {
                await Room.findOneAndUpdate(
                    { _id: roomId },
                    { $addToSet: { messages: message._id } }
                )
            }

            logger.info(`${socket.data.user.id} sent message in ${isDM ? 'DM ' : ' '}room ${roomId}`, {
                userId: socket.data.user.id,
                roomId,
                messageLength: messageContent.length
            });

            // Broadcast message to everyone in the room (including sender for confirmation)
            if (isDM)
                io.to(roomId).emit('newDmMessage', roomId, socket.data.user.id, message.toObject());
            else
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