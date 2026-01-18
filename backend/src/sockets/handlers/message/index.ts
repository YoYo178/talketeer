import { TalketeerSocket, TalketeerSocketServer } from '@src/types';
import { getSendMessageEventCallback } from './sendMessage';
import { registerReadMessageHandler } from './readMessage';

export const registerMessageHandlers = (
  io: TalketeerSocketServer,
  socket: TalketeerSocket,
) => {
  socket.on('sendMessage', getSendMessageEventCallback(io, socket));
  registerReadMessageHandler(socket);
};
