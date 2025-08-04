import { TalketeerSocket, TalketeerSocketServer } from '@src/types';

export function registerSocketHandlers(io: TalketeerSocketServer, socket: TalketeerSocket) {
    socket.on('disconnect', (reason, description) => {
        console.log(`${socket.id} disconnected`);
    });

    socket.on('disconnecting', (reason, description) => {
        console.log(`${socket.id} disconnecting`)
    });

    socket.on('error', (err) => {
        console.error(`An error occured for ${socket.id}`);
        console.error(err)
    });
}