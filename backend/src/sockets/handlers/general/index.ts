import type { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';

import { getDisconnectEventCallback } from './disconnect.js';
import { getDisconnectingEventCallback } from './disconnecting.js';
import { getErrorEventCallback } from './error.js';

export function registerGeneralHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
  socket.on('disconnect', getDisconnectEventCallback(io, socket));
  socket.on('disconnecting', getDisconnectingEventCallback(io, socket));
  socket.on('error', getErrorEventCallback(io, socket));
}
