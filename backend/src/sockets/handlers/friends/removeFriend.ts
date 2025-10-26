import { saveNotification } from '@src/services/notification.service';
import { deactivateDMRoom } from '@src/services/room.service';
import { getUser, removeFriendObject } from '@src/services/user.service';
import { AckFunc, ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';

export const getRemoveFriendCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['removeFriend'] => {
    return async (userId: string, ack: AckFunc) => {
        try {
            const selfUserId = socket.data.user.id;
            const friendUserId = userId;

            const friendUser = await getUser(friendUserId);
            const selfUser = (await getUser(selfUserId))!;
            const existingFriendObj = selfUser.friends.find(friendObj => friendObj.userId.toString() === friendUserId && friendObj.status === 'confirmed');

            if (!friendUser)
                throw new Error('Invalid User ID');

            if (!existingFriendObj)
                throw new Error('Friend not found');

            await removeFriendObject(selfUserId, friendUserId);

            logger.info(`${selfUser.username} removed '${friendUser.username} from their friend list.`, {
                userId: socket.data.user.id,
                userIds: [selfUserId, friendUserId]
            });

            // Now we do have a reason to hold ack for this :]
            const dmRoom = await deactivateDMRoom(selfUserId, friendUserId);

            if (!dmRoom)
                throw new Error('An error occured while trying to deactivate the DM room');

            // Save notification
            const notificationObj = await saveNotification(friendUserId, { content: `${selfUser.username} has removed you from their friend list.`, type: 'friend-delete' });

            // Push notification to the friend user
            io.to(friendUserId).emit('notification', notificationObj, { dmRoomId: dmRoom._id });

            ack({ success: true });
        } catch (err) {
            logger.error('Error removing friend', {
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