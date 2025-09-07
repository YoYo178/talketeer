import type { Socket } from "socket.io-client"
import { startListeningMessageEvents, stopListeningMessageEvents } from "./message.sockets";
import type { QueryClient } from "@tanstack/react-query";

export function startListeningRoomEvents(socket: Socket, queryClient?: QueryClient) {
    stopListeningRoomEvents(socket);

    socket.on('memberJoined', (roomId: string, userId: string) => {
        console.log(`A new member joined the room (${roomId}):`, userId)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('memberLeft', (roomId: string, userId: string) => {
        console.log(`A member left the room (${roomId}):`, userId)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('memberKicked', (roomId: string, userId: string, kickedBy: string, reason: string) => {
        console.log(`${userId} has been kicked out of the room (${roomId}) by ${kickedBy} due to the following reason:`, reason)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('memberBanned', (roomId: string, userId: string, bannedBy: string, reason: string) => {
        console.log(`${userId} has been banned from the room (${roomId}) by ${bannedBy} due to the following reason:`, reason)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    startListeningMessageEvents(socket, queryClient);
}

export function stopListeningRoomEvents(socket: Socket) {
    socket.off('memberJoined');
    socket.off('memberLeft');
    socket.off('memberKicked');
    socket.off('memberBanned');

    stopListeningMessageEvents(socket);
}