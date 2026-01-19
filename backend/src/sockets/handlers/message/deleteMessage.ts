import { Message, Room } from '@src/models';
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';

export const getDeleteMessageEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['deleteMessage'] => {
  return async (roomId, messageId, ack) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to delete message');
      return;
    }

    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new Error('Message not found');
      }

      const isSender = message.sender.toString() === socket.data.user.id;

      // Check if user is room admin (owner)
      const room = await Room.findById(roomId);
      const isRoomOwner = room?.owner?.toString() === socket.data.user.id;

      // Only the sender or room owner can delete the message
      if (!isSender && !isRoomOwner) {
        throw new Error('You can only delete your own messages or messages in rooms you own');
      }

      // Soft delete - mark as deleted (will be hard deleted after retention period)
      message.isDeleted = true;
      message.deletedAt = new Date();
      await message.save();

      logger.info(`${socket.data.user.id} deleted message ${messageId} in room ${roomId}`, {
        userId: socket.data.user.id,
        roomId,
        messageId,
        deletedBy: socket.data.user.id,
      });

      // Broadcast to everyone in the room
      io.to(roomId).emit('messageDeleted', roomId, message.sender.toString(), socket.data.user.id, messageId);

      ack({ success: true });
    } catch (err) {
      logger.error('Error deleting message', {
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
