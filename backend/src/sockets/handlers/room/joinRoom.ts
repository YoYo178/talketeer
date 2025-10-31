import { getRoom, getRoomByCode, joinRoom } from '@src/services/room.service';
import { ClientToServerEvents, IRoom, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import { joinRoomSchema } from '@src/schemas';
import logger from '@src/utils/logger.utils';
import { getBan, isUserBanned } from '@src/services/ban.service';

export const getJoinRoomEventCallback = (_: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['joinRoom'] => {
  return async ({ method, data }, ack) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to join room');
      return;
    }

    try {
      // Validate input
      joinRoomSchema.safeParse({ method, data });

      const userId = socket.data.user.id;
      let roomId: string | null = null;

      let roomById: IRoom | null = null;
      let roomByCode: IRoom | null = null;

      switch (method) {
      case 'id':
        roomById = await getRoom(data);
        if (!roomById)
          throw new Error('Room not found');
        roomId = data;
        break;

      case 'code':
        roomByCode = await getRoomByCode(data);
        if (!roomByCode)
          throw new Error('Room not found');
        roomId = roomByCode._id.toString();
        break;

      default:
        throw new Error('Unknown join method');
      }

      const room = await getRoom(roomId);

      if (!room)
        throw new Error('Room ID not found');

      const isBanned = await isUserBanned(userId, roomId);

      // Need a manual ack fail for this one
      if (isBanned) {
        const ban = await getBan(userId, roomId);

        // Not possible unless something went REALLY BAD
        if (!ban)
          return;

        ack({
          success: false,
          data: {
            roomId,
            ban: {
              created: ban.createdAt.valueOf(),
              expiry: ban.expiresAt?.valueOf() ?? null,
              isPermanent: ban.isPermanent,
            },
          },
          error: 'You have been' + (ban.isPermanent ? ' permanently' : '') + ' banned from joining this room.',
        });
        return;
      }

      if (room.visibility === 'private' && method === 'id' && userId !== room.owner?.toString())
        throw new Error('The room you are trying to join is private.');

      if (room.memberCount >= room.memberLimit)
        throw new Error('The room you are trying to join is full!');

      // Handle database join process
      await joinRoom(userId, roomId);

      // Join the specified room for the client
      socket.join(roomId);
      logger.info(`${socket.data.user.username} joined room ${roomId} via method '${method}'`, {
        userId: socket.data.user.id,
        roomId,
        method,
      });

      // Broadcast the member join event to everyone in this room (except the joiner)
      socket.to(roomId).emit('memberJoined', roomId, userId);

      // Let other people (even ones not in the room) refetch the latest room details
      socket.broadcast.emit('roomUpdated', roomId);
      ack({ success: true, data: { roomId } });
    } catch (err) {
      logger.error('Error joining room', {
        userId: socket.data.user.id,
        method,
        data,
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