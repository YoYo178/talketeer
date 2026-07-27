import type { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';

import { getJoinRoomEventCallback } from './joinRoom.js';
import { getLeaveRoomEventCallback } from './leaveRoom.js';
import { getCreateRoomEventCallback } from './createRoom.js';
import { getDeleteRoomEventCallback } from './deleteRoom.js';
import { getUpdateRoomEventCallback } from './updateRoom.js';
import { getKickFromRoomEventCallback } from './kickFromRoom.js';
import { getBanFromRoomEventCallback } from './banFromRoom.js';

export function registerRoomHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
  socket.on('joinRoom', getJoinRoomEventCallback(io, socket));
  socket.on('leaveRoom', getLeaveRoomEventCallback(io, socket));
  socket.on('createRoom', getCreateRoomEventCallback(io, socket));
  socket.on('deleteRoom', getDeleteRoomEventCallback(io, socket));
  socket.on('updateRoom', getUpdateRoomEventCallback(io, socket));

  socket.on('kickFromRoom', getKickFromRoomEventCallback(io, socket));
  socket.on('banFromRoom', getBanFromRoomEventCallback(io, socket));

  // Creating factory functions for below events would be overkill really, only downside is consistency
  // Room Typing events
  socket.on('startTyping', (userId, roomId, username) =>
    socket.broadcast.to(roomId).emit('userTypingStart', roomId, userId, username),
  );
  socket.on('stopTyping', (userId, roomId) =>
    socket.broadcast.to(roomId).emit('userTypingEnd', roomId, userId),
  );

  // DM Room Typing events
  socket.on('startDmTyping', (userId, roomId, username) =>
    socket.broadcast.to(roomId).emit('dmUserTypingStart', roomId, userId, username),
  );
  socket.on('stopDmTyping', (userId, roomId) =>
    socket.broadcast.to(roomId).emit('dmUserTypingEnd', roomId, userId),
  );
}
