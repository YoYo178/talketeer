import type { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types.js';

import { getAcceptFriendRequestCallback } from './acceptFriendRequest.js';
import { getDeclineFriendRequestCallback } from './declineFriendRequest.js';

import { getRevokeFriendRequestCallback } from './revokeFriendRequest.js';
import { getSendFriendRequestCallback } from './sendFriendRequest.js';

import { getRemoveFriendCallback } from './removeFriend.js';

export function registerFriendHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
  socket.on('acceptFriendRequest', getAcceptFriendRequestCallback(io, socket));
  socket.on('declineFriendRequest', getDeclineFriendRequestCallback(io, socket));
    
  socket.on('sendFriendRequest', getSendFriendRequestCallback(io, socket));
  socket.on('revokeFriendRequest', getRevokeFriendRequestCallback(io, socket));

  socket.on('removeFriend', getRemoveFriendCallback(io, socket));
}