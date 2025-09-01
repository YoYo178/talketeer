import { type FC } from 'react'

interface MessageTextProps {
    content: string;
    className?: string;
}

export const MessageText: FC<MessageTextProps> = ({ content, className }) => {
    return (
        <div className={'break-words max-w-[80%] ' + (className ? className : '')}>{content}</div>
    )
}
