import mongoose from 'mongoose';
import { Message } from '@src/models';
import logger from '@src/utils/logger.utils';
import { TalketeerSocket } from '@src/types';

const getReadMessageCallback =
  (socket: TalketeerSocket) =>
    async (payload: { messageId: string }) => {
      try {
        if (!socket.data?.user) return;

        const message = await Message.findById(payload.messageId);
        if (!message) return;

        const userObjectId = new mongoose.Types.ObjectId(socket.data.user.id);

        if (!message.seenBy?.some((id) => id.equals(userObjectId))) {
          message.seenBy?.push(userObjectId);
          await message.save();

          socket.to(message.room.toString()).emit('notification', {
            type: 'MESSAGE_READ',
            messageId: message._id,
            userId: socket.data.user.id,
          });
        }
      } catch (error) {
        logger.error('Error marking message as read', error);
      }
    };

export const registerReadMessageHandler = (socket: TalketeerSocket) => {
  socket.on('readMessage', getReadMessageCallback(socket));
};
