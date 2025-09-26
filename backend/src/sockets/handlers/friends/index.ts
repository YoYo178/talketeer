import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

import { getAcceptFriendRequestCallback } from './acceptFriendRequest';
import { getDeclineFriendRequestCallback } from './declineFriendRequest';

import { getRevokeFriendRequestCallback } from './revokeFriendRequest';
import { getSendFriendRequestCallback } from './sendFriendRequest';

import { getRemoveFriendCallback } from './removeFriend';

export function registerFriendHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('acceptFriendRequest', getAcceptFriendRequestCallback(io, socket));
    socket.on('declineFriendRequest', getDeclineFriendRequestCallback(io, socket));
    
    socket.on('sendFriendRequest', getSendFriendRequestCallback(io, socket));
    socket.on('revokeFriendRequest', getRevokeFriendRequestCallback(io, socket));

    socket.on('removeFriend', getRemoveFriendCallback(io, socket));
}