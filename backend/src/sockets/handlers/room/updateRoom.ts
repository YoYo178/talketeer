import { updateRoom, getRoom } from '@src/services/room.service';
import { getUser } from '@src/services/user.service';
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import { updateRoomSchema } from '@src/schemas';
import logger from '@src/utils/logger.utils';

export const getUpdateRoomEventCallback = (_: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['updateRoom'] => {
  return async (roomId, name, visibility, memberLimit, ack) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to update room');
      return;
    }

    try {
      // Validate input
      updateRoomSchema.parse({ name, visibility, memberLimit });

      const userId = socket.data.user.id;
      const user = await getUser(userId);
      if (!user)
        throw new Error('User not found');

      const room = await getRoom(roomId);
      if (!room)
        throw new Error('Room not found');

      await updateRoom(roomId, {
        name,
        visibility,
        memberLimit,
      });

      // Broadcast room update to all users so they can refetch the latest details
      socket.broadcast.emit('roomUpdated', roomId);

      logger.info(`${socket.data.user.id} updated room ${roomId}`, {
        userId: socket.data.user.id,
        roomId,
        oldRoomData: {
          name: room.name,
          visibility: room.visibility,
          memberLimit: room.memberLimit,
        },
        newRoomData: {
          name,
          visibility,
          memberLimit,
        },
      });

      ack({ success: true });
    } catch (err) {
      logger.error('Error updating room', {
        userId: socket.data.user.id,
        roomData: {
          name,
          visibility,
          memberLimit,
        },
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