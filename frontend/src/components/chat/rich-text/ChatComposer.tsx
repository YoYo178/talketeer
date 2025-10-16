import { useState } from 'react';
import { SendButton } from './SendButton';
import { AttachFileButton } from './AttachFileButton';
import { socket } from '@/socket';
import { Textarea } from '@/components/ui/textarea';
import { GIFButton } from './GIFButton';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';

export const ChatComposer = () => {
    const { joinedRoomId } = useRoomsStore();
    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (!joinedRoomId)
            return;

        socket.emit('sendMessage', joinedRoomId, message, ({ success }) => {
            if (success)
                setMessage('');
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form's default submit action

        if (message.trim())
            sendMessage();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault(); // Stop newline input if shift key isn't held
            handleSubmit(e as unknown as React.FormEvent);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='p-3 flex items-center gap-3'>
            <AttachFileButton />
            <Textarea
                rows={1}
                placeholder='Start typing...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className='shadow-sm bg-background/90 border border-secondary focus-within:ring-2 focus-within:ring-primary min-h-0 resize-none max-h-24 overflow-y-auto whitespace-pre-wrap wrap-anywhere text-sm'
            />
            <div className='flex'>
                <GIFButton />
                <SendButton />
            </div>
        </form>
    )
}
