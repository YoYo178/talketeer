import { useLayoutEffect, useState } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { MessageList } from './messages/MessageList';
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { ChatHeader } from './ChatHeader';
import { Separator } from '../ui/separator';
import { ArrowLeft } from 'lucide-react';
import { RoomMemberList } from './rooms/RoomMemberList';
import { ChatButton } from './rich-text/utility/ChatButton';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { socket } from '@/socket';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useMe } from '@/hooks/network/users/useGetMeQuery';

export const ChatWindow = () => {
    const queryClient = useQueryClient();
    const [isJoining, setIsJoining] = useState(false);
    const [isInMemberList, setIsInMemberList] = useState(false);
    const { setData: setDialogData } = useDialogStore();

    const roomsStore = useRoomsStore();
    const { joinedRoomId, selectedRoomId, setJoinedRoomId, setSelectedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string };

    const me = useMe();

    useLayoutEffect(() => {
        if (isInMemberList)
            setIsInMemberList(false);
    }, [joinedRoomId])

    const selectedRoom = useRoom(selectedRoomId);
    const joinedRoom = useRoom(joinedRoomId);

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
        <div className='flex-1 flex flex-col bg-accent dark:bg-primary-foreground rounded-xl overflow-auto'>

            {selectedRoomId ? (
                <>
                    <div className='flex flex-col w-full h-full items-center justify-center p-4 gap-2'>
                        <p className='text-3xl font-bold'>{selectedRoom?.name}</p>
                        <p className='text-m text-muted-foreground'>Members online: {selectedRoom?.memberCount}/{selectedRoom?.memberLimit}</p>


                        {selectedRoom?.visibility === 'private' && !selectedRoom?.isSystemGenerated ? (
                            <>
                                {selectedRoom?.owner === me?._id ? (
                                    <div className="flex gap-4">
                                        <Button onClick={handleClearSelection}>Cancel</Button>
                                        <Button onClick={handleRoomJoin}>Join</Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-4">
                                        <p className='text-l text-center'>This is a private room, you cannot join unless you are invited by the owner or you have the code for the room.</p>
                                        <Button className='w-fit' onClick={handleClearSelection}>Go back</Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Button onClick={handleClearSelection}>Cancel</Button>
                                <Button onClick={handleRoomJoin}>Join</Button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    {isInMemberList ? (
                        <>
                            <div className='flex flex-row w-full items-center p-4 gap-2'>
                                <ChatButton onClick={() => setIsInMemberList(false)}>
                                    <ArrowLeft className='size-5' />
                                </ChatButton>

                                <p className='text-xl'>Members in {joinedRoom?.name}</p>
                            </div>
                            <Separator />
                            <RoomMemberList />
                        </>
                    ) : (
                        <>
                            <ChatHeader onToggleMemberList={setIsInMemberList} />
                            <Separator />
                            <MessageList />
                            <Separator />
                            <ChatComposer roomId={joinedRoom?._id} />
                        </>
                    )
                    }
                </>
            )}
        </div >
    )
}
