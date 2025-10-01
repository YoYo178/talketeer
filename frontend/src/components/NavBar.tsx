import { MessagesSquare } from 'lucide-react';
import { useGlobalStore } from '@/hooks/state/useGlobalStore';
import { ExpandableProfileCard } from './chat/profile/ExpandableProfileCard';

export const NavBar = () => {
    const { membersOnline } = useGlobalStore();

    return (
        <div className='flex items-center bg-accent dark:bg-primary-foreground rounded-xl'>

            <div className='flex gap-2 p-5'>
                <MessagesSquare className='size-8' />
                <div className="flex flex-col">
                    <h1 className='text-2xl font-bold'>Talketeer</h1>
                    <p className='text-sm text-muted-foreground font-bold'>Users online: {membersOnline}</p>
                </div>
            </div>
            <ExpandableProfileCard />
        </div>
    )
}
