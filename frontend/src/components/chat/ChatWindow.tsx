import { type FC } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { MessageList } from './messages/MessageList';
import { useGetRoomByIdQuery } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { ChatHeader } from './ChatHeader';
import { Separator } from '../ui/separator';
import type { IRoom } from '@/types/room.types';

interface ChatWindowProps {
    selectedRoomId: string | null;
    onSelectRoomId: (roomId: string | null) => void;
}

export const ChatWindow: FC<ChatWindowProps> = ({ selectedRoomId, onSelectRoomId }) => {
    const { data } = useGetRoomByIdQuery({
        queryKey: ['rooms', selectedRoomId || ''],
        pathParams: { roomId: selectedRoomId || '' },
        enabled: !!selectedRoomId
    });
    const selectedRoom: IRoom = data?.data?.room;

    if (!selectedRoom) {
        return (
            <div className='flex-1 bg-background p-6 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-xl font-semibold mb-1'>Join a room to get started!</div>
                    <div className='text-sm text-muted-foreground'>Select a room on the left or create a new one.</div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col bg-card rounded-xl overflow-auto'>
            <ChatHeader selectedRoom={selectedRoom} onSelectRoomId={onSelectRoomId} />
            <Separator />
            <MessageList messages={selectedRoom.messages} selectedRoomId={selectedRoomId} />
            <Separator />
            <ChatComposer roomId={selectedRoom._id} />
        </div>
    )
}
