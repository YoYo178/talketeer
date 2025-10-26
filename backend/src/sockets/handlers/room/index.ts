import { TalketeerSocket, TalketeerSocketServer } from '@src/types';

import { getJoinRoomEventCallback } from './joinRoom';
import { getLeaveRoomEventCallback } from './leaveRoom';
import { getCreateRoomEventCallback } from './createRoom';
import { getDeleteRoomEventCallback } from './deleteRoom';
import { getUpdateRoomEventCallback } from './updateRoom';
import { getKickFromRoomEventCallback } from './kickFromRoom';
import { getBanFromRoomEventCallback } from './banFromRoom';

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
    socket.on('startTyping', (userId, roomId, username, ack) => socket.broadcast.to(roomId).emit('userTypingStart', roomId, userId, username));
    socket.on('stopTyping', (userId, roomId, ack) => socket.broadcast.to(roomId).emit('userTypingEnd', roomId, userId));

    // DM Room Typing events
    socket.on('startDmTyping', (userId, roomId, username, ack) => socket.broadcast.to(roomId).emit('dmUserTypingStart', roomId, userId, username));
    socket.on('stopDmTyping', (userId, roomId, ack) => socket.broadcast.to(roomId).emit('dmUserTypingEnd', roomId, userId));
}