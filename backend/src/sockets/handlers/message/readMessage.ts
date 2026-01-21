import mongoose from 'mongoose';
import { Message } from '@src/models';
import logger from '@src/utils/logger.utils';
import { TalketeerSocket } from '@src/types';

export const registerReadMessageHandler = (socket: TalketeerSocket) => {
  socket.on(
    'message_read',
    async (payload: { messageId: string, userId: string }) => {
      try {
        const message = await Message.findById(payload.messageId);
        if (!message) return;

        const userObjectId = new mongoose.Types.ObjectId(payload.userId);

        if (!message.seenBy?.some((id) => id.equals(userObjectId))) {
          message.seenBy?.push(userObjectId);
          await message.save();
        }
      } catch (error) {
        logger.error('Error marking message as read', error);
      }
    },
  );
};
