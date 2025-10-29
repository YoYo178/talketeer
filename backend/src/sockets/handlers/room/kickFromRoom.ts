import { kickFromRoomSchema } from '@src/schemas';
import { getRoom, isUserInRoom, leaveRoom } from '@src/services/room.service';
import { getUser } from '@src/services/user.service';
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';

export const getKickFromRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['kickFromRoom'] => {
  return async (roomId, userId, kickedBy, reason) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to kick a member from a room');
      return;
    }

    try {
      kickFromRoomSchema.parse({ roomId, userId, kickedBy, reason });

      const room = await getRoom(roomId);

      if (!room)
        throw new Error('Room not found');

      const admin = await getUser(kickedBy);

      if (!admin)
        throw new Error('The person trying to kick the user cannot be found.');

      if (admin._id.toString() !== room.owner?.toString())
        throw new Error('You are not the owner of this room');

      const user = await getUser(userId);

      if (!user)
        throw new Error('The person you are trying to kick cannot be found');

      const isMember = await isUserInRoom(roomId, user._id.toString());

      if (!isMember)
        throw new Error('The person you are trying to kick is not a member of this room.');

      await leaveRoom(user._id.toString(), roomId);

      const targetSocket = (await io.in(user._id.toString()).fetchSockets())[0];
      targetSocket.leave(roomId);

      logger.info(`${admin._id.toString()} kicked ${user._id.toString()} from ${room._id.toString()}`, {
        roomId,
        kickedBy,
        userId,
      });

      io.emit('memberKicked', roomId, user._id.toString(), admin._id.toString(), reason);

      io.emit('roomUpdated', roomId);
    } catch (err) {
      logger.error('[NO ACK] Error kicking member from room', {
        roomId,
        kickedBy,
        userId,
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
      });
    }
  };
};