import { saveNotification } from '@src/services/notification.service';
import { removeFriendObject, getUser } from '@src/services/user.service';
import { AckFunc, ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';
import mongoose from 'mongoose';

export const getDeclineFriendRequestCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['declineFriendRequest'] => {
  return async (userId: string, ack: AckFunc) => {
    // Since we're the one 'declining' the friend request, we're also the receiver
    const senderId = userId;
    const receiverId = socket.data.user.id;

    try {

      if (!mongoose.isValidObjectId(userId))
        throw new Error('Invalid user ID');

      const sender = await getUser(senderId);
      const receiver = (await getUser(receiverId))!; // Non-null assertion because if we sent this event then we exist (probably...)
      const existingFriendObj = receiver.friends.find(friendObj => friendObj.userId.toString() === senderId);

      if (!sender)
        throw new Error('Invalid User ID');

      if (!existingFriendObj)
        throw new Error('No such friend request found');

      // Make sure the sender doesn't decline it themselves somehow, lol
      if (existingFriendObj.direction === 'outgoing')
        throw new Error('Only the other user can decline this friend request');

      logger.info(`'${receiver._id.toString()}' declined friend request from '${sender._id.toString()}'.`, {
        senderId,
        receiverId,
      });

      await removeFriendObject(senderId, receiverId);

      // Save notification
      const notificationObj = await saveNotification(
        senderId,
        {
          content: `${receiver.username} has declined your friend request.`,
          type: 'friend-delete',
        },
      ); // TODO: type: 'friend-declined'?

      // Push notification to the sender
      io.to(senderId).emit('notification', notificationObj);

      ack({ success: true });
    } catch (err) {
      logger.error('Error accepting friend request', {
        senderId,
        receiverId,
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