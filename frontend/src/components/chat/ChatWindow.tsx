import { type FC } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';
import { ChatButton } from './rich-text/utility/ChatButton';
import { MessageList } from './messages/MessageList';
import { socket } from '@/socket';
import { stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useGetRoomByIdQuery } from '@/hooks/network/rooms/useGetRoomByIdQuery';

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

    const handleRoomLeave = () => {
        if (!selectedRoom)
            return;

        socket.emit('roomLeft', selectedRoom._id, (success: boolean) => {
            if (success) {
                stopListeningRoomEvents(socket);
                onSelectRoomId(null);
            }
        });
    }

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
        <div className='flex-1 bg-card m-3 ml-0 p-0 rounded-xl flex flex-col'>
            <div className='flex p-4'>
                <p className='text-xl'>{selectedRoom.name}</p>
                <div className='ml-auto flex gap-2'>
                    <ChatButton><Users className='size-5' /></ChatButton>
                    <Button onClick={handleRoomLeave}>Leave room</Button>
                </div>
            </div>

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
