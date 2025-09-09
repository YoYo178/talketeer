import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

import { getJoinRoomEventCallback } from './joinRoom';
import { getLeaveRoomEventCallback } from './leaveRoom';
import { getCreateRoomEventCallback } from './createRoom';
import { getDeleteRoomEventCallback } from './deleteRoom';
import { getUpdateRoomEventCallback } from './updateRoom';

export function registerRoomHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('joinRoom', getJoinRoomEventCallback(io, socket));
    socket.on('leaveRoom', getLeaveRoomEventCallback(io, socket));
    socket.on('createRoom', getCreateRoomEventCallback(io, socket));
    socket.on('deleteRoom', getDeleteRoomEventCallback(io, socket));
    socket.on('updateRoom', getUpdateRoomEventCallback(io, socket));
}