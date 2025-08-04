import { TalketeerSocket, TalketeerSocketServer } from '@src/types/socket.types';

export function registerSocketHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('disconnect', (reason, description) => {
        console.log(`${socket.data.user.username} disconnected`);
    });

    socket.on('disconnecting', (reason, description) => {
        console.log(`${socket.data.user.username} disconnecting`)
    });

    socket.on('error', (err) => {
        console.error(`An error occured for ${socket.id}`);
        console.error(err)
    });
}