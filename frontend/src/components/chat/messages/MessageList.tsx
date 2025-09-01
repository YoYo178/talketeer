import { useEffect, useLayoutEffect, useMemo, useRef, type FC } from 'react'
import { MessageBlock } from './MessageBlock'
import type { IMessage } from '@/types/message.types';

interface MessageListProps {
    messages: IMessage[];
    selectedRoomId?: string | null;
}

export const MessageList: FC<MessageListProps> = ({ messages, selectedRoomId }) => {
    const isAtBottom = useRef(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.target as HTMLDivElement;

        isAtBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    }

    const scrollToBottom = () => {
        if (chatEndRef.current)
            chatEndRef.current.scrollIntoView({ behavior: 'auto' })
    };

    useLayoutEffect(() => {
        scrollToBottom();
    }, [selectedRoomId])

    useEffect(() => {
        if (isAtBottom.current)
            scrollToBottom();
    }, [messages])

    const messageElements = useMemo(() => {
        if (!messages.length) return [];

        const messageGroups = [];

        let currentGroup: IMessage[] = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const previousMessage = messages[i - 1];

            if (previousMessage && previousMessage.sender === message.sender) {
                currentGroup.push(message);
            } else {
                if (currentGroup.length)
                    messageGroups.push(currentGroup);

                currentGroup = [message];
            }
        }

        if (currentGroup.length)
            messageGroups.push(currentGroup);

        return messageGroups.map(group => (
            <MessageBlock senderId={group[0].sender} messages={group} />
        ))
    }, [messages])

    return (
        <div className='w-full p-4 flex flex-col flex-1 overflow-y-auto relative' onScroll={handleScroll}>
            {messageElements}
            <div ref={chatEndRef} />
        </div>
    )
}
