import type { QueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

export function handleSocketConnection(socket: Socket, queryClient?: QueryClient) {
    socket.on('roomUpdated', (roomId: string) => {
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    })
}

export function handleSocketDisconnection(socket: Socket) {
    socket.off('roomUpdated');
}