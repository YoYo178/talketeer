import { io } from 'socket.io-client';
import { SERVER_URL } from './config/api.config';
import type { TalketeerSocket } from './types/socket.types';

export const socket: TalketeerSocket = io(SERVER_URL, {
    withCredentials: true,
    autoConnect: false,
    path: '/socket.io'
}) as TalketeerSocket;