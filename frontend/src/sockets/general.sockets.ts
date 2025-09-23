import { useDialogStore } from "@/hooks/state/useDialogStore";
import { useGlobalStore } from "@/hooks/state/useGlobalStore";
import { useRoomsStore } from "@/hooks/state/useRoomsStore";
import type { APIResponse } from "@/types/api.types";
import type { INotification } from "@/types/notification.types";
import type { IRoom } from "@/types/room.types";
import type { TalketeerSocket } from "@/types/socket.types";
import type { IPublicUser, IUser } from "@/types/user.types";
import type { QueryClient } from "@tanstack/react-query";

export function handleSocketConnection(socket: TalketeerSocket, queryClient?: QueryClient) {
    handleSocketDisconnection(socket);

    socket.on('roomCreated', (room) => {
        // Update rooms data
        const oldRoomsData: APIResponse<{ rooms: IRoom[] }> | undefined = queryClient?.getQueryData(['rooms']);
        const newRoomsData: APIResponse<{ rooms: IRoom[] }> = {
            success: true,
            data: {
                rooms: [...(oldRoomsData?.data?.rooms || []), room]
            }
        }
        queryClient?.setQueryData(['rooms'], newRoomsData)

        const oldMeData: APIResponse<{ user: IUser }> | undefined = queryClient?.getQueryData(['users', 'me']);
        if (room.owner === oldMeData?.data?.user._id)
            queryClient?.invalidateQueries({ queryKey: ['users', 'me'] });
    })

    socket.on('roomDeleted', (roomId, ownerId) => {

        // Get old rooms data
        const oldRooms = queryClient?.getQueryData<APIResponse<{ rooms: IRoom[] }>>(['rooms'])?.data?.rooms;
        if (!oldRooms) return;

        const deletedRoom = oldRooms.find(r => r._id === roomId);

        // Update rooms data
        queryClient.setQueryData(['rooms'], (old: APIResponse<{ rooms: IRoom[] }>) =>
            old ? { success: true, data: { rooms: oldRooms.filter(r => r._id !== roomId) } } : old
        );

        // Get our own user object, and invalidate queries if we were in the room
        const me = queryClient.getQueryData<APIResponse<{ user: IUser }>>(['users', 'me'])?.data?.user;
        if (me?.room === roomId) {
            queryClient?.invalidateQueries({ queryKey: ['users', 'me'] });

            // If we're not the room owner, display the room deleted info dialog
            if (me._id !== ownerId) {
                const owner = queryClient.getQueryData<APIResponse<{ user: IPublicUser }>>(['users', ownerId])?.data?.user;

                const { setData } = useDialogStore.getState()
                setData({
                    type: 'roomDeletion',
                    roomName: deletedRoom?.name || '',
                    username: owner?.username || ''
                })
            }
        }

        // If we had this room selected, clear it
        if (useRoomsStore.getState().selectedRoomId)
            useRoomsStore.getState().setSelectedRoomId(null);
    })

    socket.on('roomUpdated', (roomId) => {
        queryClient?.invalidateQueries({ queryKey: ['rooms', roomId] });
    });

    socket.on('notification', (notification) => {
        console.log('Received new notification: ', notification);

        queryClient?.setQueryData(
            ['notifications'],
            (old: APIResponse<{ notifications: INotification[] }>) =>
                old ? { success: true, data: { notifications: [...(old.data?.notifications || []), notification] } } : old
        )

        useGlobalStore.getState().setHasNewNotifications(true);
    });

    socket.on('memberOnline', (membersCount, userId) => {
        useGlobalStore.getState().setMembersOnline(membersCount);
    })

    socket.on('memberOffline', (membersCount, userId) => {
        useGlobalStore.getState().setMembersOnline(membersCount);
    })
}

export function handleSocketDisconnection(socket: TalketeerSocket) {
    // Remove all general socket events
    socket.off('roomCreated');
    socket.off('roomDeleted');
    socket.off('roomUpdated');
    socket.off('notification');
    socket.off('memberOnline');
    socket.off('memberOffline');

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