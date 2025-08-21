import { Input } from '@/components/ui/input'
import type { ReactSetState } from '@/types/react.types';
import type { FC } from 'react';
import { SendButton } from './SendButton';
import { AttachFileButton } from './AttachFileButton';

interface ChatComposerProps {
    message: string;
    setMessage: ReactSetState<string>;
}

export const ChatComposer: FC<ChatComposerProps> = ({ message, setMessage }) => {
    return (
        <div className='p-3 flex gap-3'>
            <AttachFileButton />
            <Input
                placeholder='Start typing...'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='shadow-sm bg-background/90 border border-secondary focus-within:ring-2 focus-within:ring-primary'
            />
            <SendButton />
        </div>
    )
}
