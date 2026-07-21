import { leaveRoom } from '@src/services/room.service.js';
import { getUser } from '@src/services/user.service.js';
import type { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';
import logger from '@src/utils/logger.utils.js';
import { onlineMembers } from '@src/utils/socket.utils.js';

export const getDisconnectEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
  return async (reason: string, description: string) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user disconnected', { reason, description });
      return;
    }

    logger.info(`${socket.data.user.id} disconnected`, {
      userId: socket.data.user.id,
      reason,
      description,
    });

    const userId = socket.data.user.id;

    const user = await getUser(userId);
    if (user?.room) {

      await leaveRoom(userId, user.room.toString());

      // Broadcast room update to all other users
      socket.broadcast.emit('roomUpdated', user.room.toString());
    }

    onlineMembers.delete(userId);

    io.emit('userOffline', onlineMembers.size, userId);
  };
};