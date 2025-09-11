import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { IPublicUser, IUser } from '@/types/user.types';
import { UserRound } from 'lucide-react'
import type { FC } from 'react';
import React from 'react';

export const MessageProfilePictureSkeleton = React.memo(() => {
    return (
        <Skeleton
            className='flex items-center justify-center size-10 min-w-10 max-w-10 aspect-square rounded-full bg-[#d8d8d8] dark:bg-[#242429] self-start'
        />
    )
})

interface MessageProfilePictureProps {
    user?: IUser | IPublicUser
}

export const MessageProfilePicture: FC<MessageProfilePictureProps> = ({ user }) => {
    const hasAvatar = !!user?.avatarURL && user?.avatarURL.trim().length > 0;

    return (
        <div className='flex items-center justify-center size-10 min-w-10 max-w-10 aspect-square rounded-full bg-[#d8d8d8] dark:bg-[#242429] self-start'>
            {hasAvatar ? (
                <Avatar className='rounded-full size-10 object-cover drop-shadow-sm'>
                    <AvatarImage src={user?.avatarURL} />
                    <AvatarFallback>{user?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>
            ) : (
                <UserRound />
            )}
        </div>
    );
};