import type { Socket } from "socket.io-client"
import { startListeningMessageEvents, stopListeningMessageEvents } from "./message.sockets";

export function startListeningRoomEvents(socket: Socket) {
    stopListeningRoomEvents(socket);

    socket.on('memberJoined', (userId: string) => {
        console.log("A new member joined the room:", userId)
    });

    socket.on('memberLeft', (userId: string) => {
        console.log("A member left the room:", userId)
    });

    socket.on('memberKicked', (userId: string, kickedBy: string, reason: string) => {
        console.log(`${userId} has been kicked out of the room by ${kickedBy} due to the following reason:`, reason)
    });

    socket.on('memberBanned', (userId: string, bannedBy: string, reason: string) => {
        console.log(`${userId} has been banned from the room by ${bannedBy} due to the following reason:`, reason)
    });

    startListeningMessageEvents(socket);
}

export function stopListeningRoomEvents(socket: Socket) {
    socket.off('memberJoined');
    socket.off('memberLeft');
    socket.off('memberKicked');
    socket.off('memberBanned');

    stopListeningMessageEvents(socket);
}