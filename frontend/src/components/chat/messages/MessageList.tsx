import { useCallback, useLayoutEffect, useMemo, useRef, type FC } from 'react'
import { MessageBlock, MessageBlockSkeleton } from './MessageBlock'
import type { IMessage } from '@/types/message.types';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { useGetMessagesQuery } from '@/hooks/network/messages/useGetMessagesQuery';
import { Separator } from '@/components/ui/separator';

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
    selectedRoomId: string;
}

export const MessageList: FC<MessageListProps> = ({ selectedRoomId }) => {
    const chatEndRef = useRef<HTMLDivElement>(null);
    const isAtBottom = useRef(false);

    const { data, isLoading, fetchNextPage, hasNextPage } = useGetMessagesQuery({
        queryKey: ['messages', selectedRoomId],
        queryParams: { roomId: selectedRoomId }
    })
    const messagePages = useMemo(
        () => [...(data?.pages || [])].reverse(),
        [data?.pages]
    )

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const element = e.target as HTMLDivElement;

        isAtBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 50;

        if (element.scrollTop === 0 && hasNextPage) {
            const prevHeight = element.scrollHeight;

            fetchNextPage?.().then(() => {
                requestAnimationFrame(() => {
                    const newHeight = element.scrollHeight;
                    element.scrollTop = newHeight - prevHeight;
                })
            });
        }
    }, [hasNextPage, fetchNextPage])

    const messageElements = useMemo(() => {
        return messagePages.flatMap(page => {
            const messages = (page.data?.messages || []);
            if (!messages.length) return [];

            const messageGroups: IMessage[][] = [];
            let currentGroup: IMessage[] = [];

            messages.forEach((message, index) => {
                const previousMessage = messages[index - 1];

                if (previousMessage && previousMessage.sender === message.sender) {
                    currentGroup.push(message);
                } else {
                    if (currentGroup.length)
                        messageGroups.push(currentGroup);

                    currentGroup = [message];
                }
            })

            if (currentGroup.length)
                messageGroups.push(currentGroup);

            return messageGroups.map(group => (
                <MessageBlock key={group[0]._id} senderId={group[0].sender} messages={group} />
            ))
        })
    }, [messagePages])

    const scrollToBottom = () => {
        if (chatEndRef.current)
            chatEndRef.current.scrollIntoView({ behavior: 'auto' });
    };

    // This might look awkward, but is intended
    // this hook must only run when messageElements
    // transitions from empty to non-empty
    useLayoutEffect(() => {
        scrollToBottom();
    }, [messageElements.length === 0])

    if (!messageElements.length) {
        return (
            <div className='flex-1 flex items-center justify-center overflow-hidden m-6'>
                {isLoading ? (
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
            {messageElements.length > 0 && !hasNextPage && (
                <div className="flex items-center my-2">
                    <Separator className='flex-1' />
                    <span className="mx-2 bg-card px-2 text-muted-foreground">
                        You've reached the end of this chatroom!
                    </span>
                    <Separator className='flex-1' />
                </div>
            )}
            {messageElements}
            <div ref={chatEndRef} />
        </ScrollArea>
    );
}
