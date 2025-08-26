import { type FC } from 'react'
import { MessageEntry } from './MessageEntry'

interface MessageListProps {
    messages: any[]; // TODO
}

export const MessageList: FC<MessageListProps> = ({ messages }) => {
    return (
        <div className='w-full p-4 flex flex-col gap-5 flex-1 overflow-y-auto'>
            {messages.map((message) => (
                <MessageEntry message={message} />
            ))}
        </div>
    )
}
