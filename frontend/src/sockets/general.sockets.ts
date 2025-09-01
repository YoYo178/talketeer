import type { QueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

export function handleSocketConnection(socket: Socket, queryClient?: QueryClient) {
    handleSocketDisconnection(socket);

    socket.on('roomUpdated', (roomId: string) => {
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('notification', () => {
        console.log('You have received a new notification')
    });
}

export function handleSocketDisconnection(socket: Socket) {
    socket.off('roomUpdated');
    socket.off('notification');
}