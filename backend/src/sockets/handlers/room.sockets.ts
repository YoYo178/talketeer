import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

export function registerRoomHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('roomJoined', (userId, roomId) => {
        socket.join(roomId);
        console.log(`${socket.data.user.username} joined room ${roomId}`);
        io.to(roomId).emit('memberJoined', userId, socket.data.user.username);
    });

    socket.on('roomLeft', (userId, roomId) => {
        socket.leave(roomId);
        console.log(`${socket.data.user.username} left room ${roomId}`);
        io.to(roomId).emit('memberLeft', userId, socket.data.user.username);
    });
}