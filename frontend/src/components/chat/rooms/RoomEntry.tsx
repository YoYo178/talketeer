import { useGetRoomByIdQuery } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { socket } from '@/socket';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets';
import type { IRoom } from '@/types/room.types'
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react'
import { Lock } from 'lucide-react'

interface RoomEntryProps {
    room: IRoom;
    onSelectRoomId: (roomId: string | null) => void;
    selectedRoomId: string | null;
}

export const RoomEntry: FC<RoomEntryProps> = ({ room: localRoom, onSelectRoomId, selectedRoomId }) => {
    const queryClient = useQueryClient();
    const { data } = useGetRoomByIdQuery(
        {
            queryKey: ['rooms', localRoom._id],
            pathParams: { roomId: localRoom._id }
        }
    );

    const room: IRoom = data?.data?.room ?? localRoom;

    const handleRoomJoin = async () => {
        if (!room || room._id === selectedRoomId)
            return;

        if (!!selectedRoomId) {
            socket.emit('leaveRoom', selectedRoomId, (success: boolean) => {
                if (success) {
                    stopListeningRoomEvents(socket);

                    socket.emit('joinRoom', room._id, (success: boolean) => {
                        if (success) {
                            startListeningRoomEvents(socket, queryClient);
                            onSelectRoomId(room._id);
                        }
                    });
                }
            });
        } else {
            socket.emit('joinRoom', room._id, (success: boolean) => {
                if (success) {
                    startListeningRoomEvents(socket, queryClient);
                    onSelectRoomId(room._id);
                }
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
            <div className='text-xs text-muted-foreground'>Members: {room.members?.length}/{room.memberLimit}</div>
        </button>
    )
}
