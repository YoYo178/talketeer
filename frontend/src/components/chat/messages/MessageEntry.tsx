import { type FC } from 'react'

interface MessageEntryProps {
    message?: any; // TODO
}

export const MessageEntry: FC<MessageEntryProps> = ({ message }) => {
    return (
        <div>{message.content}</div>
    )
}
