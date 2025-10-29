import { handleSocketConnection } from './connection';
import { requireSocketAuth } from '@src/middlewares';
import { TalketeerSocket, TalketeerSocketServer } from '@src/types';

export function setupSocket(io: TalketeerSocketServer) {
  io.use(requireSocketAuth);
  io.on('connection', (socket: TalketeerSocket) => handleSocketConnection(io, socket));
}