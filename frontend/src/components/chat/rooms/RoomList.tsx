import type { IRoom } from '@/types/room.types';
import type { FC } from 'react';
import { RoomEntry } from './RoomEntry';

interface RoomListProps {
    rooms: IRoom[];
    onSelectRoomId: (roomId: string | null) => void;
    selectedRoomId: string | null;
}

export const RoomList: FC<RoomListProps> = ({ rooms, onSelectRoomId, selectedRoomId }) => {
    return (
        <div className='flex-1 overflow-y-auto rounded-md border border-border/40 divide-y divide-border/40'>
            {rooms.length === 0 && (
                <div className='p-3 text-sm text-muted-foreground'>No rooms found</div>
            )}
            {rooms.map(room => (
                <RoomEntry key={room._id} onSelectRoomId={onSelectRoomId} room={room} selectedRoomId={selectedRoomId} />
            ))}
        </div>
    )
}
