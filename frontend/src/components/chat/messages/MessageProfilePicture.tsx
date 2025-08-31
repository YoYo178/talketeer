import { UserRound } from 'lucide-react'
import type { FC } from 'react';

interface MessageProfilePictureProps {
    avatarURL?: string;
}

export const MessageProfilePicture: FC<MessageProfilePictureProps> = ({ avatarURL }) => {
    const hasAvatar = !!avatarURL && avatarURL.trim().length > 0;

    return (
        <div className='flex items-center justify-center size-10 min-w-10 max-w-10 aspect-square rounded-full bg-[#d8d8d8] dark:bg-[#242429] self-start'>
            {hasAvatar ? (
                <img
                    src={avatarURL}
                    alt='Profile Photo'
                    className='rounded-full size-10 object-cover drop-shadow-sm'
                />
            ) : (
                <UserRound />
            )}
        </div>
    );
};