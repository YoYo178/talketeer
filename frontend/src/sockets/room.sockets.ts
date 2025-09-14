import { startListeningMessageEvents, stopListeningMessageEvents } from "./message.sockets";
import type { QueryClient } from "@tanstack/react-query";
import type { IPublicUser, IUser } from "@/types/user.types";
import { useDialogStore } from "@/hooks/state/useDialogStore";
import type { APIResponse } from "@/types/api.types";
import type { IRoom } from "@/types/room.types";
import type { TalketeerSocket } from "@/types/socket.types";

export function startListeningRoomEvents(socket: TalketeerSocket, queryClient?: QueryClient) {
    stopListeningRoomEvents(socket);

    socket.on('memberJoined', (roomId, userId) => {
        console.log(`A new member joined the room (${roomId}):`, userId)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('memberLeft', (roomId, userId) => {
        console.log(`A member left the room (${roomId}):`, userId)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('memberKicked', (roomId, userId, kickedBy, reason) => {
        console.log(`${userId} has been kicked out of the room (${roomId}) by ${kickedBy} due to the following reason:`, reason)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });

        const room = queryClient?.getQueryData<APIResponse<{ room: IRoom }>>(['rooms', roomId])?.data?.room;

        const me = queryClient?.getQueryData<APIResponse<{ user: IUser }>>(['users', 'me'])?.data?.user;
        // We were kicked out of the room
        if (me?._id === userId) {
            queryClient?.invalidateQueries({ queryKey: ['users', 'me'] });

            const admin = queryClient?.getQueryData<APIResponse<{ user: IPublicUser }>>(['users', kickedBy])?.data?.user;

            const { setData } = useDialogStore.getState();
            setData({
                type: 'kick',
                roomName: room?.name || '',
                username: me.name,
                adminUsername: admin?.username || '',
                reason
            })
        }
    });

    socket.on('memberBanned', (roomId, userId, bannedBy, reason) => {
        console.log(`${userId} has been banned from the room (${roomId}) by ${bannedBy} due to the following reason:`, reason)
        // Invalidate room data to refresh member list
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    startListeningMessageEvents(socket, queryClient);
}

export function stopListeningRoomEvents(socket: TalketeerSocket) {
    socket.off('memberJoined');
    socket.off('memberLeft');
    socket.off('memberKicked');
    socket.off('memberBanned');

    stopListeningMessageEvents(socket);
}