import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { socket } from '@/socket';
import type { IPublicUser, IUser } from '@/types/user.types';
import { useQueryClient } from '@tanstack/react-query';
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
    popoverSide: 'left' | 'right' | 'top';
}

export const MessageProfilePicture: FC<MessageProfilePictureProps> = ({ user, popoverSide }) => {
    const queryClient = useQueryClient();
    const me = useMe();

    const isSelf = me?._id === user?._id;

    const friendObj = me?.friends.find(f => f.userId === user?._id);

    const isFriend = !!friendObj && friendObj.status === 'confirmed';
    const isPending = !!friendObj && friendObj.status === 'pending';
    const isIncoming = isPending && friendObj.direction === 'incoming';

    const refreshMeData = () => queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

    if (!user || !me)
        return;

    const handleSendFriendRequest = () => socket.emit('sendFriendRequest', user?._id, ({ success }) => success && refreshMeData());
    const handleRevokeFriendRequest = () => socket.emit('revokeFriendRequest', user._id, ({ success }) => success && refreshMeData());

    const handleAcceptFriendRequest = () => socket.emit('acceptFriendRequest', user._id, ({ success }) => success && refreshMeData());
    const handleDeclineFriendRequest = () => socket.emit('declineFriendRequest', user._id, ({ success }) => success && refreshMeData());

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button className='flex items-center justify-center size-10 min-w-10 max-w-10 aspect-square rounded-full bg-[#d8d8d8] dark:bg-[#242429] self-start'>
                    <Avatar className='rounded-full size-10 object-cover drop-shadow-sm'>
                        <AvatarImage src={user?.avatarURL} />
                        <AvatarFallback className='text-primary'>
                            {user?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent side={popoverSide} sideOffset={10} asChild>
                <div className='flex flex-col gap-4 w-fit'>

                    <div className='flex gap-2'>
                        <Avatar className='rounded-full size-10 object-cover drop-shadow-sm'>
                            <AvatarImage src={user?.avatarURL} />
                            <AvatarFallback>
                                {user?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <p className='text-md'>{user?.displayName}</p>
                            <p className='text-sm text-muted-foreground -translate-y-1'>@{user?.username}</p>
                            <p className='text-sm'>
                                Joined {new Date(user?.createdAt || '').toLocaleDateString(undefined, { dateStyle: 'long' })}
                            </p>
                        </div>
                    </div>

                    {isFriend && (
                        <p className='flex-1 text-center text-muted-foreground text-sm font-semibold'>You're friends with this user</p>
                    )}

                    {(!isSelf && !isFriend) && (
                        <div className='flex gap-2 [&>*]:flex-1'>

                            {/* Not friends with user, show them 'Add friend' button */}
                            {(!isPending) && (
                                <Button onClick={handleSendFriendRequest}>Send friend request</Button>
                            )}

                            {/* Pending friend request, and is outgoing, meaning we sent them a friend request, show 'Revoke request' button */}
                            {(isPending && !isIncoming) && (
                                <Button variant='outline' onClick={handleRevokeFriendRequest}>Friend request sent</Button>
                            )}

                            {/* Pending friend request, and is incoming, meaning we received a friend request, show 'Accept' and 'Decline' buttons */}
                            {(isPending && isIncoming) && (
                                <>
                                    <Button onClick={handleAcceptFriendRequest}>Accept friend request</Button>
                                    <Button onClick={handleDeclineFriendRequest}>Decline friend request</Button>
                                </>
                            )}

                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};