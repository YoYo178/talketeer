import { getSendMessageEventCallback } from './sendMessage.js';
import type { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';

export function registerMessageHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
  socket.on('sendMessage', getSendMessageEventCallback(io, socket));
}