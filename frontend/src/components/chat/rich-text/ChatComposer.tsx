import { Input } from '@/components/ui/input'
import type { FC } from 'react';
import { SendButton } from './SendButton';
import { AttachFileButton } from './AttachFileButton';
import { socket } from '@/socket';

interface ChatComposerProps {
    roomId: string;
    message: string;
    onMessageInput: (message: string) => void;
}

export const ChatComposer: FC<ChatComposerProps> = ({ roomId, message, onMessageInput }) => {
    const sendMessage = () => {

        socket.emit('sendMessage', roomId, message, (success: boolean) => {
            if (success) {
                onMessageInput('');
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim())
            sendMessage();
    }

    return (
        <form onSubmit={handleSubmit} className='p-3 flex gap-3'>
            <AttachFileButton />
            <Input
                placeholder='Start typing...'
                value={message}
                onChange={(e) => onMessageInput(e.target.value)}
                className='shadow-sm bg-background/90 border border-secondary focus-within:ring-2 focus-within:ring-primary'
            />
            <SendButton />
        </form>
    )
}
