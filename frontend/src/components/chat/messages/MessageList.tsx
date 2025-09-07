import { useEffect, useLayoutEffect, useMemo, useRef, type FC } from 'react'
import { MessageBlock, MessageBlockSkeleton } from './MessageBlock'
import type { IMessage } from '@/types/message.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

const MessageListSkeleton = () => {
    const alignArr: ('start' | 'end')[] = ['start', 'end']
    const skeletons = Array.from({ length: 5 }, () => ({
        align: alignArr[Math.floor(Math.random() * alignArr.length)]
    }));

    return (
        <div className='flex-1 flex flex-col'>
            {skeletons.map((skeleton, i) => (
                <MessageBlockSkeleton key={i} align={skeleton.align as 'start' | 'end'} />
            ))}
        </div>
    );
}

interface MessageListProps {
    messages: IMessage[];
    selectedRoomId?: string | null;
    areMessagesLoading: boolean;
}

export const MessageList: FC<MessageListProps> = ({ messages, selectedRoomId, areMessagesLoading }) => {
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
        if (!messages?.length) return [];

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
            <MessageBlock key={group[0]._id} senderId={group[0].sender} messages={group} />
        ))
    }, [messages])

    if (!messageElements.length) {
        return (
            <div className='flex-1 flex items-center justify-center overflow-hidden m-6'>
                {areMessagesLoading ? (
                    <MessageListSkeleton />
                ) : (
                    <div className='text-center'>
                        <p className='text-xl text-card-foreground'>This room currently has no messages.</p>
                        <p className='text-m text-muted-foreground'>Send a message to get started!</p>
                    </div>
                )}
            </div >
        )
    }

    return (
        <ScrollArea className='flex flex-col flex-1 p-4 pt-0 pb-0 overflow-y-auto overflow-x-hidden' onScroll={handleScroll}>
            {messageElements}
            <div ref={chatEndRef} />
        </ScrollArea>
    );
}
