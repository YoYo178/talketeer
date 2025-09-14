import { useGetRoomByIdQuery } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { socket } from '@/socket';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets';
import type { IRoomPublicView } from '@/types/room.types'
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react'
import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useDialogStore } from '@/hooks/state/useDialogStore';

interface RoomEntryProps {
    room: IRoomPublicView;
    onSelectRoomId: (roomId: string | null) => void;
    selectedRoomId: string | null;
}

export const RoomEntry: FC<RoomEntryProps> = ({ room: localRoom, onSelectRoomId, selectedRoomId }) => {
    const queryClient = useQueryClient();
    const [isJoining, setIsJoining] = useState(false);
    const { data } = useGetRoomByIdQuery(
        {
            queryKey: ['rooms', localRoom._id],
            pathParams: { roomId: localRoom._id }
        }
    );

    const room: IRoomPublicView = data?.data?.room ?? localRoom;

    const { setData: setDialogData } = useDialogStore();

    const handleRoomJoin = async () => {
        if (!room || room._id === selectedRoomId || isJoining)
            return;

        setIsJoining(true);

        if (!!selectedRoomId) {
            // First leave the current room
            socket.emit('leaveRoom', selectedRoomId, ({ success }) => {
                if (success) {
                    // Clean up room events for the old room
                    stopListeningRoomEvents(socket);

                    queryClient.invalidateQueries({ queryKey: ['rooms', selectedRoomId] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

                    // Small delay to ensure cleanup is complete
                    setTimeout(() => {
                        // Join the new room
                        socket.emit('joinRoom', { method: 'id', data: room._id }, ({ success, data }) => {
                            if (success) {
                                queryClient.invalidateQueries({ queryKey: ['rooms', room._id] });
                                queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                                startListeningRoomEvents(socket, queryClient);
                                onSelectRoomId(room._id);
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
            socket.emit('joinRoom', { method: 'id', data: room._id }, ({ success, data }) => {
                if (success) {
                    queryClient.invalidateQueries({ queryKey: ['rooms', room._id] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                    startListeningRoomEvents(socket, queryClient);
                    onSelectRoomId(room._id);
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
        <button
            key={room._id}
            onClick={handleRoomJoin}
            className={`w-full text-left p-3 hover:bg-accent/40 cursor-pointer ${selectedRoomId === room._id ? 'bg-accent/60' : ''}`}
        >
            <div className='flex items-center gap-2'>
                {room.visibility === 'private' && (
                    <Lock className='text-muted-foreground' size={16} />
                )}
                <div className='font-medium'>{room.name}</div>

                {room.isSystemGenerated && (
                    <span className='text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-foreground text-primary-foreground font-bold'>SYSTEM</span>
                )}
            </div>
            <div className='text-xs text-muted-foreground'>Members: {room.memberCount}/{room.memberLimit}</div>
        </button>
    )
}
