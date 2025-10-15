import { TalketeerSocket, TalketeerSocketServer } from '@src/types';

import { getDisconnectEventCallback } from './disconnect';
import { getDisconnectingEventCallback } from './disconnecting';
import { getErrorEventCallback } from './error';

export function registerGeneralHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('disconnect', getDisconnectEventCallback(io, socket));
    socket.on('disconnecting', getDisconnectingEventCallback(io, socket));
    socket.on('error', getErrorEventCallback(io, socket));
}