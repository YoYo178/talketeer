import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './config/api.config';

export const socket = io(SOCKET_SERVER_URL, { withCredentials: true, autoConnect: false });