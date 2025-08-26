import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './config/api.config';
import type { TalketeerSocket } from './types/socket.types';

export const socket: TalketeerSocket = io(SOCKET_SERVER_URL, { withCredentials: true, autoConnect: false });