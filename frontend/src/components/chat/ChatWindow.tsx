import { type FC } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { MessageList } from './messages/MessageList';
import { useGetRoomByIdQuery } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { ChatHeader } from './ChatHeader';

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
    const selectedRoom = data?.data?.room;

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

            <div className='border-t border-border/40' />

            {selectedRoom.messages.length === 0 ? (
                <div className='flex-1 items-center content-center'>
                    <div className='text-center'>
                        <p className='text-xl text-card-foreground'>This room currently has no messages.</p>
                        <p className='text-m text-muted-foreground'>Send a message to get started!</p>
                    </div>
                </div>
            ) : (
                <MessageList messages={selectedRoom.messages} selectedRoomId={selectedRoomId} />
            )}

            <div className='border-t border-border/40' />

            <ChatComposer roomId={selectedRoom._id} />
        </div>
    )
}
