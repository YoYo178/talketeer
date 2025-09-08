import type { IRoom } from "@/types/room.types";
import type { IUser } from "@/types/user.types";
import type { QueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";

export function handleSocketConnection(socket: Socket, queryClient?: QueryClient) {
    handleSocketDisconnection(socket);

    socket.on('roomCreated', (room: IRoom) => {
        // Update rooms data
        const oldRoomsData: { success: boolean, data: { rooms: IRoom[] } } | undefined = queryClient?.getQueryData(['rooms']);
        const newRoomsData: { success: boolean, data: { rooms: IRoom[] } } = {
            success: true,
            data: {
                rooms: [...(oldRoomsData?.data.rooms || []), room]
            }
        }
        queryClient?.setQueryData(['rooms'], newRoomsData)

        const oldMeData: { success: boolean, data: { user: IUser } } | undefined = queryClient?.getQueryData(['users', 'me']);
        if (room.owner === oldMeData?.data.user._id)
            queryClient?.invalidateQueries({ queryKey: ['users', 'me'] });
    })

    socket.on('roomUpdated', (roomId: string) => {
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('notification', () => {
        console.log('You have received a new notification')
    });
}

export function handleSocketDisconnection(socket: Socket) {
    // Remove all general socket events
    socket.off('roomCreated');
    socket.off('roomUpdated');
    socket.off('notification');

    // Also remove any room-specific events that might still be active
    socket.off('memberJoined');
    socket.off('memberLeft');
    socket.off('memberKicked');
    socket.off('memberBanned');

    // Remove message events
    socket.off('newMessage');
    socket.off('messageEdited');
    socket.off('messageDeleted');
}