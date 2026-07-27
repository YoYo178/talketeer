import { handleSocketConnection } from './connection.js';
import { requireSocketAuth } from '@src/middlewares/auth.middleware.js';
import type { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';

export function setupSocket(io: TalketeerSocketServer) {
  io.use(requireSocketAuth);
  io.on('connection', (socket: TalketeerSocket) => handleSocketConnection(io, socket));
}
