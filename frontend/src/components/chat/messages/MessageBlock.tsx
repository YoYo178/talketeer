import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { memo, type FC } from 'react'
import { MessageProfilePicture, MessageProfilePictureSkeleton } from './MessageProfilePicture';
import { MessageText, MessageTextSkeleton } from './MessageText';
import { useGetUserQuery } from '@/hooks/network/users/useGetUserQuery';
import type { IMessage } from '@/types/message.types';

interface MessageBlockSkeletonProps {
    align: 'start' | 'end';
}

export const MessageBlockSkeleton: FC<MessageBlockSkeletonProps> = ({ align }) => {
    const generateArbitraryLines = (minLines: number, maxLines: number, minLength: number, maxLength: number) => {
        const lines = Math.max(minLines, Math.floor(Math.random() * maxLines));

        return Array.from({ length: lines }).map(() => {
            const lineLength = Math.max(minLength, Math.floor(Math.random() * maxLength));
            return (
                <MessageTextSkeleton height={1} width={lineLength} />
            )
        })
    }

    return (
        <div className={`flex self-${align} gap-2 p-2 pb-1 mb-2 overflow-hidden` + (align === 'end' ? ' flex-row-reverse' : '')}>
            <MessageProfilePictureSkeleton />
            <div className={`flex flex-col gap-2 items-${align}`}>
                {...generateArbitraryLines(2, 5, 6, 10)}
            </div>
        </div>
    )
}

interface MessageBlockProps {
    messages: IMessage[];
    senderId: string;
}

export const MessageBlock: FC<MessageBlockProps> = memo(({ messages, senderId }) => {
    const { data } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const me = data?.data?.user;

    const isSelfMessage = senderId === me?._id;

    const { data: userData } = useGetUserQuery({
        queryKey: ['users', senderId],
        pathParams: { userId: senderId },
        enabled: !isSelfMessage
    })
    const otherUser = userData?.data?.user;

    return (
        <div className={
            'flex items-center gap-2 w-full p-2 pb-1 mb-2 hover:bg-accent ' +
            `${isSelfMessage ? 'justify-end' : 'justify-start'} `
        }>
            {isSelfMessage ? (
                <>
                    <div className='flex flex-col items-end max-w-[80%]'>
                        <p className='text-muted-foreground text-[14px]'>
                            {new Date(messages[0].createdAt).toLocaleString()}
                            <span className='text-[#383838] dark:text-[#696969] text-[14px] ml-2 mr-2'>——</span>
                            You
                        </p>
                        {messages.map(message => <MessageText key={message._id} content={message.content} />)}
                    </div>
                    <MessageProfilePicture user={me} />
                </>
            ) : (
                <>
                    <MessageProfilePicture user={otherUser} />
                    <div className='flex flex-col items-start max-w-[80%]'>
                        <p className='text-muted-foreground text-[14px]'>
                            {otherUser?.username}
                            <span className='text-[#383838] dark:text-[#696969] text-[14px] ml-2 mr-2'>——</span>
                            {new Date(messages[0].createdAt).toLocaleString()}
                        </p>
                        {messages.map(message => <MessageText key={message._id} content={message.content} />)}
                    </div>
                </>
            )}
        </div>
    )
})
