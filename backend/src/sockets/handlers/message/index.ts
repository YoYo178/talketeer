import { getSendMessageEventCallback } from './sendMessage';
import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

export function registerMessageHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('sendMessage', getSendMessageEventCallback(io, socket));
}