import { DMRoom, Room } from '@src/models/room.model.js';
import { Message } from '@src/models/message.model.js';
import type { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';
import { sendMessageSchema } from '@src/schemas/messages.schema.js';
import logger from '@src/utils/logger.utils.js';

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

      // @ts-expect-error because typescript being typescript
      if (isDM && !room.isActive)
        throw new Error('This person is not on your friend list.');

      const message = await Message.create({
        content: messageContent,
        sender: socket.data.user.id,
        room: roomId,
      });

      logger.info(`${socket.data.user.id} sent message in ${isDM ? 'DM ' : ' '}room ${roomId}`, {
        userId: socket.data.user.id,
        roomId,
        messageLength: messageContent.length,
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
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
      ack({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };
};