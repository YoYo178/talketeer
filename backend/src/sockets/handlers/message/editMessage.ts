import { Message } from '@src/models';
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';

export const getEditMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['editMessage'] => {
  return async (roomId, messageId, newContent, ack) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to edit message');
      return;
    }

    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      // Only the sender can edit their own message
      if (message.sender.toString() !== socket.data.user.id) {
        throw new Error('You can only edit your own messages');
      }

      const oldContent = message.content;

      // Update the message
      message.content = newContent;
      message.isEdited = true;
      message.editedAt = new Date();
      await message.save();

      logger.info(`${socket.data.user.id} edited message ${messageId} in room ${roomId}`, {
        userId: socket.data.user.id,
        roomId,
        messageId,
      });

      // Broadcast to everyone in the room
      io.to(roomId).emit('messageEdited', roomId, socket.data.user.id, oldContent, newContent);

      ack({ success: true });
    } catch (err) {
      logger.error('Error editing message', {
        userId: socket.data.user.id,
        roomId,
        messageId,
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
