import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

import { getJoinRoomEventCallback } from './joinRoom';
import { getLeaveRoomEventCallback } from './leaveRoom';
import { getCreateRoomEventCallback } from './createRoom';

export function registerRoomHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('joinRoom', getJoinRoomEventCallback(io, socket));
    socket.on('leaveRoom', getLeaveRoomEventCallback(io, socket));
    socket.on('createRoom', getCreateRoomEventCallback(io, socket));
}