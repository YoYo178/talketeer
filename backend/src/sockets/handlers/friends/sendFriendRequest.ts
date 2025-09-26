import { saveNotification } from "@src/services/notification.service";
import { getUser, sendUserFriendRequest } from "@src/services/user.service";
import { AckFunc, ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import logger from "@src/utils/logger.utils";

export const getSendFriendRequestCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['sendFriendRequest'] => {
    return async (userId: string, ack: AckFunc) => {
        try {
            const senderId = socket.data.user.id;
            const receiverId = userId;

            if (receiverId === senderId)
                throw new Error('You cannot send friend requests to yourself');

            const sender = await getUser(senderId);
            const receiver = await getUser(receiverId);

            if (!sender || !receiver)
                throw new Error('Invalid user ID');

            const existingFriendObj = receiver.friends.find(friendObj => friendObj.userId.toString() === senderId);

            if (existingFriendObj?.status === 'confirmed')
                throw new Error('The user is already in your friend list');

            if (existingFriendObj?.direction === 'incoming')
                throw new Error('The user\'s has already sent you a friend request.');

            if (existingFriendObj)
                throw new Error('Your friend request is already pending');

            logger.info(`${socket.data.user.username} sent a friend request to ${receiver.username}`, {
                userId: socket.data.user.id,
                senderId,
                receiverId
            });

            await sendUserFriendRequest(senderId, receiverId);

            // Save notification
            const notificationObj = await saveNotification(receiverId, { content: `${sender.username} has sent you a friend request.`, type: 'friend-request' });

            // Push notification to the receiver
            io.to(receiverId).emit('notification', notificationObj)

            ack({ success: true });
        } catch (err) {
            logger.error("Error sending friend request", {
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