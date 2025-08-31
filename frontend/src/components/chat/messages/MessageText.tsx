import { type FC } from 'react'

interface MessageTextProps {
    content: string;
    className?: string;
}

export const MessageText: FC<MessageTextProps> = ({ content, className }) => {
    return (
        <div className={'wrap-anywhere max-w-[50%] ' + (className ? className : '')}>{content}</div>
    )
}
