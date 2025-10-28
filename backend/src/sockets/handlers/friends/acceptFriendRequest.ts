import { saveNotification } from '@src/services/notification.service';
import { checkDMRoom } from '@src/services/room.service';
import { acceptUserFriendRequest, getUser } from '@src/services/user.service';
import { AckFunc, ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';
import mongoose from 'mongoose';

export const getAcceptFriendRequestCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['acceptFriendRequest'] => {
    return async (userId: string, ack: AckFunc) => {
        try {

            if (!mongoose.isValidObjectId(userId))
                throw new Error('Invalid user ID');

            // Since we're the one 'accepting' the friend request, we're also the receiver
            const senderId = userId;
            const receiverId = socket.data.user.id;

            const sender = await getUser(senderId);
            const receiver = (await getUser(receiverId))!; // Non-null assertion because if we sent this event then we exist (probably...)
            const existingFriendObj = receiver.friends.find(friendObj => friendObj.userId.toString() === senderId);

            if (!sender)
                throw new Error('Invalid User ID');

            if (!existingFriendObj)
                throw new Error('No such friend request found');

            // Make sure the sender doesn't accept it themselves somehow, lol
            if (existingFriendObj.direction === 'outgoing')
                throw new Error('Only the other user can accept this friend request');

            logger.info(`${receiver.username} accepted '${sender.username}'s friend request.`, {
                userId: socket.data.user.id,
                senderId,
                receiverId
            });

            await acceptUserFriendRequest(senderId, receiverId);

            // Now we do have a reason to hold ack for this :]
            const dmRoom = await checkDMRoom(senderId, receiverId);

            if (!dmRoom)
                throw new Error('An error occured while creating/reactivating DM room');

            // Save notification
            const notificationObj = await saveNotification(senderId, { content: `${receiver.username} has accepted your friend request.`, type: 'friend-new' });

            // Push notification to the sender
            io.to(senderId).emit('notification', notificationObj, { dmRoomId: dmRoom._id.toString() });

            ack({ success: true });
        } catch (err) {
            logger.error('Error accepting friend request', {
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