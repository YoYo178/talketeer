import type { IRoomPublicView } from '@/types/room.types';
import type { FC } from 'react';
import { RoomEntry } from './RoomEntry';
import { ScrollArea } from '@/components/ui/scroll-area';

interface RoomListProps {
    rooms: IRoomPublicView[];
}

export const RoomList: FC<RoomListProps> = ({ rooms }) => {
    return (
        <ScrollArea className='flex-1 rounded-md border border-border/40'>
            <div className='flex min-h-[200px] h-full flex-col divide-y divide-border/40'>
                {rooms.length <= 0 ? (
                    <p className='p-3 text-xl text-muted-foreground m-auto'>No rooms found</p>
                ) : (
                    rooms.map((room) => (
                        <RoomEntry key={room._id} room={room} />
                    ))
                )}
            </div>
        </ScrollArea>
    )
}
