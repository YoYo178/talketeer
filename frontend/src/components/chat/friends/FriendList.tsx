import { FriendEntry } from './FriendEntry';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { IUserFriend } from '@/types/user.types';
import type { FC } from 'react';

interface FriendListProps {
    friends: IUserFriend[];
}

export const FriendList: FC<FriendListProps> = ({ friends }) => {
    return (
        <ScrollArea className='flex-1 overflow-y-auto rounded-md border border-border/40'>
            {friends.length <= 0 ? (
                <div className='p-3 flex-col w-full text-center'>
                    <p className='text-sm text-muted-foreground font-semibold'>No friends found</p>
                    <p className='text-sm text-muted-foreground'>Add some friends to get the party going!</p>
                </div>
            ) : (
                <div className='flex flex-col gap-2'>
                    {friends.map(friendObj => <FriendEntry key={friendObj.userId} friendObject={friendObj} />)}
                </div>
            )}
        </ScrollArea>
    )
}
