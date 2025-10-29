import { leaveRoom } from '@src/services/room.service';
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from '@src/types';
import logger from '@src/utils/logger.utils';
import mongoose from 'mongoose';

export const getLeaveRoomEventCallback = (_: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['leaveRoom'] => {
  return async (roomId, ack) => {
    if (!socket.data?.user) {
      logger.warn('Unauthenticated user attempted to leave room');
      return;
    }

    try {
      if (!mongoose.isValidObjectId(roomId))
        throw new Error('Invalid room ID');

      const userId = socket.data.user.id;

      // Handle database leave process
      await leaveRoom(userId, roomId);

      // Leave the specified room for the client
      socket.leave(roomId);
      logger.info(`${socket.data.user.id} left room ${roomId}`, {
        userId: socket.data.user.id,
        roomId,
      });

      // Broadcast the member leave event to everyone in this room (except the leaver)
      socket.to(roomId).emit('memberLeft', roomId, socket.data.user.id);

      // Let other people (even ones not in the room) refetch the latest room details
      socket.broadcast.emit('roomUpdated', roomId);

      ack({ success: true });
    } catch (err) {
      logger.error('Error leaving room', {
        userId: socket.data.user.id,
        roomId,
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