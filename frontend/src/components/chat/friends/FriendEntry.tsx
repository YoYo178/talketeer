import { Button } from '@/components/ui/button';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { useGetUser } from '@/hooks/network/users/useGetUserQuery';
import { socket } from '@/socket';
import type { IUserFriend } from '@/types/user.types'
import { useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react'
import { UserProfilePicture } from '../UserProfilePicture';

interface FriendEntryProps {
    friendObject: IUserFriend;
}

export const FriendEntry: FC<FriendEntryProps> = ({ friendObject }) => {
    const queryClient = useQueryClient();

    const me = useMe();
    const user = useGetUser(friendObject.userId);

    if (!user || !me)
        return;

    const friendObj = me.friends.find(f => f.userId === user._id);

    const isFriend = !!friendObj && friendObj.status === 'confirmed';
    const isPending = !!friendObj && friendObj.status === 'pending';
    const isIncoming = isPending && friendObj.direction === 'incoming';

    const refreshMeData = () => queryClient.invalidateQueries({ queryKey: ['users', 'me'] })

    const handleAcceptFriendRequest = () => socket.emit('acceptFriendRequest', user._id, ({ success }) => success && refreshMeData());
    const handleDeclineFriendRequest = () => socket.emit('declineFriendRequest', user._id, ({ success }) => success && refreshMeData());

    const handleRevokeFriendRequest = () => socket.emit('revokeFriendRequest', user._id, ({ success }) => success && refreshMeData());

    const handleRemoveFriend = () => socket.emit('removeFriend', user._id, ({ success }) => success && refreshMeData());
    const handleSendMessage = () => { }; // TODO

    return (
        <div className="p-2 flex flex-col gap-2 rounded-xl hover:bg-[#dad8d8] dark:hover:bg-accent">
            <div className='flex gap-2'>

                <UserProfilePicture user={user} popoverSide='right' />

                {!user.displayName ? (
                    <p className='text-muted-foreground self-center font-semibold'>@{user.username}</p>
                ) : (
                    <div className="flex flex-col">
                        <p className='font-semibold'>{user.displayName}</p>
                        <p className='text-sm text-muted-foreground -translate-y-1'>@{user.username}</p>
                    </div>
                )}
            </div>

            <div className='w-full flex gap-2 flex-wrap [&>*]:flex-1'>

                {/* Is in our friend list already, show 'Remove' and 'Message' buttons */}
                {isFriend && (
                    <>
                        <Button onClick={handleRemoveFriend}>Remove Friend</Button>
                        <Button onClick={handleSendMessage}>Send Message</Button>
                    </>
                )}

                {/* Pending friend request, and is incoming, meaning we received a friend request, show 'Accept' and 'Decline' buttons */}
                {(isPending && isIncoming) && (
                    <>
                        <Button onClick={handleAcceptFriendRequest}>Accept friend request</Button>
                        <Button onClick={handleDeclineFriendRequest}>Decline friend request</Button>
                    </>
                )}

                {/* Pending friend request, and is outgoing, meaning we sent them a friend request, show 'Revoke request' button */}
                {(isPending && !isIncoming) && (
                    <Button variant='outline' onClick={handleRevokeFriendRequest}>Friend request sent</Button>
                )}

            </div>

        </div>
    )
}
