import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { memo, type FC } from 'react'
import { MessageProfilePicture } from './MessageProfilePicture';
import { MessageText } from './MessageText';
import { useGetUserQuery } from '@/hooks/network/users/useGetUserQuery';
import type { IMessage } from '@/types/message.types';

interface MessageBlockProps {
    messages: IMessage[];
    senderId: string;
}

export const MessageBlock: FC<MessageBlockProps> = memo(({ messages, senderId }) => {
    const { data } = useGetMeQuery({ queryKey: ['users', 'me'] });

    const isSelfMessage = senderId === data?.data?.user._id;

    const { data: userData } = useGetUserQuery({
        queryKey: ['users', senderId],
        pathParams: { userId: senderId },
        enabled: !isSelfMessage
    })

    return (
        <div className={
            'flex items-center gap-2 w-full p-2 pb-1 mb-2 hover:bg-accent ' +
            `${isSelfMessage ? 'justify-end' : 'justify-start'} `
        }>
            {isSelfMessage ? (
                <>
                    <div className='flex flex-col items-end w-full'>
                        <p className='text-muted-foreground text-[14px]'>
                            {new Date(messages[0].createdAt).toLocaleString()}
                            <span className='text-[#383838] dark:text-[#696969] text-[14px] ml-2 mr-2'>——</span>
                            You
                        </p>
                        {messages.map(message => <MessageText content={message.content} />)}
                    </div>
                    <MessageProfilePicture avatarURL={data?.data?.user.avatarURL} />
                </>
            ) : (
                <>
                    <MessageProfilePicture avatarURL={userData?.data?.user.avatarURL} />
                    <div className='flex flex-col items-start w-full'>
                        <p className='text-muted-foreground text-[14px]'>
                            {userData?.data?.user.username}
                            <span className='text-[#383838] dark:text-[#696969] text-[14px] ml-2 mr-2'>——</span>
                            {new Date(messages[0].createdAt).toLocaleString()}
                        </p>
                        {messages.map(message => <MessageText content={message.content} />)}
                    </div>
                </>
            )}
        </div>
    )
})
