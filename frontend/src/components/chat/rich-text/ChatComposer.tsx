import { Input } from '@/components/ui/input'
import { useState, type FC } from 'react';
import { SendButton } from './SendButton';
import { AttachFileButton } from './AttachFileButton';
import { socket } from '@/socket';

interface ChatComposerProps {
    roomId: string;
}

export const ChatComposer: FC<ChatComposerProps> = ({ roomId }) => {
    const [message, setMessage] = useState('');
    const sendMessage = () => {

        socket.emit('sendMessage', roomId, message, (success: boolean) => {
            if (success)
                setMessage('');
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
                onChange={(e) => setMessage(e.target.value)}
                className='shadow-sm bg-background/90 border border-secondary focus-within:ring-2 focus-within:ring-primary'
            />
            <SendButton />
        </form>
    )
}
