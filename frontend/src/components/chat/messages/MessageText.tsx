import { type FC } from 'react'

interface MessageTextProps {
    content: string;
    className?: string;
}

export const MessageText: FC<MessageTextProps> = ({ content, className }) => {
    return (
        <div className={'wrap-anywhere ' + (className ? className : '')}>{content}</div>
    )
}
