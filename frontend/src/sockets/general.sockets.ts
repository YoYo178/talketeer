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

        // Update user object
        const oldMeData: { success: boolean, data: { user: IUser } } | undefined = queryClient?.getQueryData(['users', 'me']);
        const newMeData: { success: boolean, data: { user: IUser } } = {
            success: true,
            data: {
                user: {
                    ...oldMeData?.data.user,
                    room: room._id
                }
            }
        }
        queryClient?.setQueryData(['users', 'me'], newMeData);
    })

    socket.on('roomUpdated', (roomId: string) => {
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('notification', () => {
        console.log('You have received a new notification')
    });
}

export function handleSocketDisconnection(socket: Socket) {
    socket.off('roomCreated');
    socket.off('roomUpdated');
    socket.off('notification');
}