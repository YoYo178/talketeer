import { Users, X } from 'lucide-react'
import { Button } from '../ui/button'
import { ChatButton } from './rich-text/utility/ChatButton'
import type { IRoomPublicView } from '@/types/room.types'
import type { FC } from 'react';
import { useState } from 'react';
import { socket } from '@/socket';
import { stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useQueryClient } from '@tanstack/react-query';

interface ChatHeaderProps {
    selectedRoom: IRoomPublicView;
    onSelectRoomId: (roomId: string | null) => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ selectedRoom, onSelectRoomId }) => {
    const queryClient = useQueryClient();
    const [isLeaving, setIsLeaving] = useState(false);

    const handleRoomLeave = () => {
        if (!selectedRoom || isLeaving)
            return;

        setIsLeaving(true);
        socket.emit('leaveRoom', selectedRoom._id, ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: ['rooms', selectedRoom._id] });
                stopListeningRoomEvents(socket);
                onSelectRoomId(null);
            }
            setIsLeaving(false);
        });
    }

    return (
        <div className='flex p-4'>
            <p className='text-xl'>{selectedRoom.name}</p>
            <div className='ml-auto flex gap-2'>
                <ChatButton><Users className='size-5' /></ChatButton>
                <Button onClick={handleRoomLeave}><X />Leave room</Button>
            </div>
        </div>
    )
}
