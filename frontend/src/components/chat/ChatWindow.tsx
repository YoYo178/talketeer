import { useLayoutEffect, useState,useEffect } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { MessageList } from './messages/MessageList';
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { ChatHeader } from './ChatHeader';
import { Separator } from '../ui/separator';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { socket } from '@/socket';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import type { IRoomPublicView } from '@/types/room.types';
import { ChatMemberList } from './ChatMemberList';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';

// TODO: Fix ChatMemberList for smaller screens!

export const ChatWindow = () => {
    const { dmRoomId } = useRoomsStore();
    const queryClient = useQueryClient();
    const [isJoining, setIsJoining] = useState(false);
    const [isInMemberList, setIsInMemberList] = useState(false);
    const { setData: setDialogData } = useDialogStore();

    const roomsStore = useRoomsStore();
    const { joinedRoomId, selectedRoomId, setJoinedRoomId, setSelectedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string };

    const me = useMe();

    useEffect(() => {
        if (!joinedRoomId || !me?._id) return;

        socket.emit('message_read', {
            messageId: joinedRoomId,
            userId: me._id,
        });
    }, [joinedRoomId, me?._id]);

    const isMobile = useMediaQuery('(max-width: 767px)')

    useLayoutEffect(() => {
        if (isInMemberList)
            setIsInMemberList(false);
    }, [joinedRoomId])

    const selectedRoom = useRoom<{ room: IRoomPublicView }>(selectedRoomId);

    const handleClearSelection = () => {
        if (!selectedRoomId)
            return;

        setSelectedRoomId(null);
    }

    const handleRoomJoin = async () => {
        if (!selectedRoom || selectedRoomId === joinedRoomId || isJoining)
            return;

        setIsJoining(true);

        if (!!joinedRoomId) {
            // First leave the current room
            socket.emit('leaveRoom', joinedRoomId, ({ success }) => {
                if (success) {
                    // Clean up room events for the old room
                    stopListeningRoomEvents(socket);

                    queryClient.invalidateQueries({ queryKey: ['rooms', joinedRoomId] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

                    // Small delay to ensure cleanup is complete
                    setTimeout(() => {
                        // Join the new room
                        socket.emit('joinRoom', { method: 'id', data: selectedRoom._id }, ({ success, data }) => {
                            if (success) {
                                queryClient.invalidateQueries({ queryKey: ['rooms', selectedRoom._id] });
                                queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                                startListeningRoomEvents(socket, queryClient);
                                setJoinedRoomId(selectedRoom._id);
                                setSelectedRoomId(null);
                            } else {
                                if (!!data?.ban)
                                    setDialogData({
                                        type: 'ban',
                                        ...data.ban
                                    })
                            }
                            setIsJoining(false);
                        });
                    }, 100);
                } else {
                    setIsJoining(false);
                }
            });
        } else {
            socket.emit('joinRoom', { method: 'id', data: selectedRoom._id }, ({ success, data }) => {
                if (success) {
                    queryClient.invalidateQueries({ queryKey: ['rooms', selectedRoom._id] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                    startListeningRoomEvents(socket, queryClient);
                    setJoinedRoomId(selectedRoom._id);
                    setSelectedRoomId(null);
                } else {
                    if (!!data?.ban)
                        setDialogData({
                            type: 'ban',
                            ...data.ban
                        })
                }
                setIsJoining(false);
            });
        }
    }

    return (
        <div className='flex-1 flex flex-col overflow-hidden'>
            {selectedRoomId ? (
                <div className='flex flex-col w-full h-full items-center justify-center p-12 gap-2 text-center'>
                    <h2 className='text-xl md:text-2xl font-bold'>{selectedRoom?.name}</h2>
                    <p className='text-muted-foreground text-sm md:text-base'>Members online: {selectedRoom?.memberCount}/{selectedRoom?.memberLimit}</p>

                    {selectedRoom?.visibility === 'private' && !selectedRoom?.isSystemGenerated ? (
                        selectedRoom?.owner === me?._id ? (
                            <div className="flex gap-4">
                                <Button onClick={handleClearSelection}>Cancel</Button>
                                <Button onClick={handleRoomJoin}>Join</Button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <p>This is a private room, you cannot join unless you are invited by the owner or you have the code for the room.</p>
                                <Button className='w-fit' onClick={handleClearSelection}>Go back</Button>
                            </div>
                        )
                    ) : (
                        <div className="flex gap-4">
                            <Button onClick={handleClearSelection}>Cancel</Button>
                            <Button onClick={handleRoomJoin}>Join</Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex gap-3 h-full">
                    <div className="flex-1 flex flex-col bg-accent dark:bg-primary-foreground rounded-xl">
                        <ChatHeader />
                        <Separator />
                        <MessageList />
                        <Separator />
                        <ChatComposer />
                    </div>

                    {!dmRoomId && !isMobile && <ChatMemberList />}
                </div>
            )}
        </div>
    )
}
