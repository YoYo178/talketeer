import { saveNotification } from '@src/services/notification.service';
import { getUser, removeFriendObject } from '@src/services/user.service';
import { AckFunc, ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';
import logger from '@src/utils/logger.utils';

export const getRevokeFriendRequestCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['revokeFriendRequest'] => {
    return async (userId: string, ack: AckFunc) => {
        try {
            // Since we're the one 'revoking' the friend request, we're also the sender
            const senderId = socket.data.user.id;
            const receiverId = userId;

            const sender = (await getUser(senderId))!; // Non-null assertion because if we sent this event then we exist (probably...)
            const existingFriendObj = sender.friends.find(friendObj => friendObj.userId.toString() === receiverId);

            const receiver = await getUser(receiverId);
            if (!receiver)
                throw new Error('Invalid User ID');

            if (!existingFriendObj)
                throw new Error('No such friend request found');

            // Make sure the sender doesn't accept it themselves somehow, lol
            if (existingFriendObj.direction === 'incoming')
                throw new Error('Only the other user can revoke this friend request');

            logger.info(`${socket.data.user.username} revoked their friend request to ${receiver.username}`, {
                userId: socket.data.user.id,
                senderId,
                receiverId
            });

            await removeFriendObject(senderId, receiverId);

            // Save notification
            const notificationObj = await saveNotification(receiverId, { content: `${sender.username} has revoked their friend request.`, type: 'friend-delete' }); // TODO: type: 'friend-revoked'?

            // Push notification to the sender
            io.to(receiverId).emit('notification', notificationObj)

            ack({ success: true });
        } catch (err) {
            logger.error('Error revoking friend request', {
                userId: socket.data.user.id,
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