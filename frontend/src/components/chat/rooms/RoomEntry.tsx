import { useGetRoomByIdQuery } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { socket } from '@/socket';
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets';
import type { IRoom } from '@/types/room.types'
import { type FC } from 'react'

interface RoomEntryProps {
    room: IRoom;
    onSelectRoom: (room: IRoom) => void;
    selectedRoom: IRoom | null;
}

export const RoomEntry: FC<RoomEntryProps> = ({ room: localRoom, onSelectRoom, selectedRoom }) => {
    const { data } = useGetRoomByIdQuery(
        {
            queryKey: ['rooms', localRoom._id],
            pathParams: { roomId: localRoom._id }
        }
    );

    const room = data?.data?.room ?? localRoom;

    const handleRoomJoin = async () => {
        if (!room || room._id === selectedRoom?._id)
            return;

        if (!!selectedRoom) {
            socket.emit('roomLeft', selectedRoom._id, (success: boolean) => {
                if (success) {
                    stopListeningRoomEvents(socket);

                    socket.emit('roomJoined', room._id, (success: boolean) => {
                        if (success) {
                            startListeningRoomEvents(socket);
                            onSelectRoom(room);
                        }
                    });
                }
            });
        } else {
            socket.emit('roomJoined', room._id, (success: boolean) => {
                if (success) {
                    startListeningRoomEvents(socket);
                    onSelectRoom(room);
                }
            });
        }
    }

    return (
        <button
            key={room?._id}
            onClick={handleRoomJoin}
            className={`w-full text-left p-3 hover:bg-accent/40 cursor-pointer ${selectedRoom?._id === room?._id ? 'bg-accent/60' : ''}`}
        >
            <div className='flex items-center gap-2'>
                <div className='font-medium'>{room?.name}</div>
                {(room?.isSystemGenerated) && (
                    <span className='text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-foreground text-primary-foreground font-bold'>SYSTEM</span>
                )}
            </div>
            <div className='text-xs text-muted-foreground'>Members: {room?.members?.length}/{room?.memberLimit}</div>
        </button>
    )
}
