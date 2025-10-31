import { io } from 'socket.io-client';
import { SOCKET_SERVER_URL } from './config/api.config';
import type { TalketeerSocket } from './types/socket.types';

const serverURL = import.meta.env.PROD ? SOCKET_SERVER_URL + '/talketeer' : SOCKET_SERVER_URL

export const socket: TalketeerSocket = io(serverURL, { withCredentials: true, autoConnect: false });