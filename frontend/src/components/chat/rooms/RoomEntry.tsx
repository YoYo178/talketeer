import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import type { IRoomPublicView } from '@/types/room.types'
import { useState, type FC } from 'react'
import { Lock } from 'lucide-react'
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { socket } from '@/socket';
import { stopListeningRoomEvents, startListeningRoomEvents } from '@/sockets/room.sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { useMe } from '@/hooks/network/users/useGetMeQuery';

interface RoomEntryProps {
    room: IRoomPublicView;
}

export const RoomEntry: FC<RoomEntryProps> = ({ room: localRoom }) => {
    const { dmRoomId, setDmRoomId } = useRoomsStore();
    const queryClient = useQueryClient();
    const { setData: setDialogData } = useDialogStore();
    const { joinedRoomId, selectedRoomId, setSelectedRoomId, setJoinedRoomId } = useRoomsStore();

    const [isJoining, setIsJoining] = useState(false);

    const room = useRoom<{ room: IRoomPublicView }>(localRoom._id);
    const selectedRoom = useRoom<{ room: IRoomPublicView }>(selectedRoomId);

    const me = useMe();

    if (!room)
        return;

    const handleRoomSelect = () => {
        if (joinedRoomId && room._id === joinedRoomId) {
            setSelectedRoomId(null);
            return;
        }

        setSelectedRoomId(room._id);
    }

    const handleRoomJoin = async () => {
        if (!!dmRoomId)
            setDmRoomId(null);

        if (!selectedRoom || selectedRoomId === joinedRoomId || isJoining || !me)
            return;

        if (selectedRoom.visibility === 'private' && selectedRoom.owner !== me._id)
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
            socket.emit('joinRoom', { method: 'id', data: room._id }, ({ success, data }) => {
                if (success) {
                    queryClient.invalidateQueries({ queryKey: ['rooms', room._id] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                    startListeningRoomEvents(socket, queryClient);
                    setJoinedRoomId(room._id);
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
        <button
            key={room._id}
            onClick={handleRoomSelect}
            onDoubleClick={handleRoomJoin}
            className={`w-full text-left p-3 hover:bg-accent/40 cursor-pointer ${joinedRoomId === room._id ? 'bg-accent/60' : ''} ${selectedRoomId === room._id ? 'bg-accent text-accent-foreground' : ''}`}
        >
            <div className='flex items-center gap-2'>
                {room.visibility === 'private' && (
                    <Lock className='text-muted-foreground' size={16} />
                )}
                <h1 className='text-sm md:text-base font-medium'>{room.name}</h1>

                {room.isSystemGenerated && (
                    <span className='text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-foreground text-primary-foreground font-bold'>SYSTEM</span>
                )}
            </div>
            <div className='text-xs text-muted-foreground'>Members: {room.memberCount}/{room.memberLimit}</div>
        </button>
    )
}
