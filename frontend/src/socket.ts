import { io } from 'socket.io-client';
import { SERVER_URL } from './config/api.config';
import type { TalketeerSocket } from './types/socket.types';

const isProduction = import.meta.env.PROD;

export const socket: TalketeerSocket = io(SERVER_URL, {
    withCredentials: true,
    autoConnect: false,
    path: isProduction ? '/talketeer/socket.io/' : '/socket.io/'
}) as TalketeerSocket;