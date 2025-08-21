import type { IRoom } from '@/types/room.types'
import { useState } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { Button } from '../ui/button';
import { Users } from 'lucide-react';
import { ChatButton } from './rich-text/utility/ChatButton';

export const ChatWindow = ({ selectedRoom, onSelectRoom }: { selectedRoom: IRoom | null, onSelectRoom: (room: IRoom | null) => void }) => {
    const [message, setMessage] = useState('');

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
                    <Button onClick={() => onSelectRoom(null)}>Leave room</Button>
                </div>
            </div>

            <div className="border-t border-border/40" />

            <div className='flex-1 flex overflow-y-auto p-4'>
                {/* Messages list placeholder until backend is ready */}
                <div className='flex-1 self-center text-center'>
                    <p className='text-xl text-card-foreground'>This room currently has no messages.</p>
                    <p className='text-m text-muted-foreground'>Send a message to get started!</p>
                </div>
            </div>

            <div className="border-t border-border/40" />

            <ChatComposer message={message} onMessageInput={setMessage} />
        </div>
    )
}
