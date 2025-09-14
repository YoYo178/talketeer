import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { socket } from '@/socket';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets';
import type { IRoomPublicView } from '@/types/room.types'
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react'
import { useState } from 'react'
import { Lock } from 'lucide-react'
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';

interface RoomEntryProps {
    room: IRoomPublicView;
}

export const RoomEntry: FC<RoomEntryProps> = ({ room: localRoom }) => {
    const queryClient = useQueryClient();
    const [isJoining, setIsJoining] = useState(false);
    const room = useRoom(localRoom._id);

    const { setData: setDialogData } = useDialogStore();
    const { joinedRoomId, setJoinedRoomId } = useRoomsStore();

    if (!room)
        return;

    const handleRoomJoin = async () => {
        if (room._id === joinedRoomId || isJoining)
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
                        socket.emit('joinRoom', { method: 'id', data: room._id }, ({ success, data }) => {
                            if (success) {
                                queryClient.invalidateQueries({ queryKey: ['rooms', room._id] });
                                queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                                startListeningRoomEvents(socket, queryClient);
                                setJoinedRoomId(room._id);
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
                    setJoinedRoomId(room._id);
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
            className={`w-full text-left p-3 hover:bg-accent/40 cursor-pointer ${joinedRoomId === room._id ? 'bg-accent/60' : ''}`}
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
