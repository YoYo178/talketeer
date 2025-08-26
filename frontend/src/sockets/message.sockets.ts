import type { Socket } from "socket.io-client";

export function startListeningMessageEvents(socket: Socket) {
    socket.on('newMessage', (userId: string, message: string) => {
        console.log(`Received new message from ${userId}: ${message}`);
    });

    socket.on('messageEdited', (userId: string, oldMessage: string, newMessage: string) => {
        console.log(`${userId} edited their message from '${oldMessage}' to '${newMessage}'`);
    });

    socket.on('messageDeleted', (userId: string, deletedBy: string, message: string) => {
        if (userId === deletedBy)
            return console.log(`${deletedBy} has deleted their message: ${message}`)

        console.log(`${deletedBy} has deleted ${userId}'s message: ${message}`);
    });
}

export function stopListeningMessageEvents(socket: Socket) {
    socket.off('newMessage')
    socket.off('messageEdited')
    socket.off('messageDeleted')
}