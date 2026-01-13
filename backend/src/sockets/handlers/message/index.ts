import { getSendMessageEventCallback } from './sendMessage';
import { getEditMessageEventCallback } from './editMessage';
import { getDeleteMessageEventCallback } from './deleteMessage';
import { TalketeerSocket, TalketeerSocketServer } from '@src/types';

export function registerMessageHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
  socket.on('sendMessage', getSendMessageEventCallback(io, socket));
  socket.on('editMessage', getEditMessageEventCallback(io, socket));
  socket.on('deleteMessage', getDeleteMessageEventCallback(io, socket));
}