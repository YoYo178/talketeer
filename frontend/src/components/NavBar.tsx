import { MessagesSquare } from 'lucide-react';
import { useGlobalStore } from '@/hooks/state/useGlobalStore';
import { ExpandableProfileCard } from './chat/profile/ExpandableProfileCard';
import { Toaster } from './ui/sonner';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';

export const NavBar = () => {
    const { usersOnline, isAvatarCardOpen } = useGlobalStore();

    const isMobile = useMediaQuery('(max-width: 530px)');

    return (
        <div className='flex items-center bg-accent dark:bg-primary-foreground rounded-xl px-5'>

            {isMobile ? (
                <div className={`overflow-hidden origin-left transition-[opacity,visibility,max-width] ease-out ${!isAvatarCardOpen ? 'opacity-100 visible max-w-[200px] duration-800' : 'opacity-0 invisible max-w-0 duration-300'}`}>
                    <div className={`flex gap-2 min-w-[200px]`}>
                        <MessagesSquare className='size-8' />
                        <div className="flex flex-col">
                            <h1 className='text-2xl font-bold'>Talketeer</h1>
                            <p className='text-sm text-muted-foreground font-bold'>Users online: {usersOnline}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='flex gap-2'>
                    <MessagesSquare className='size-8' />
                    <div className="flex flex-col">
                        <h1 className='text-2xl font-bold'>Talketeer</h1>
                        <p className='text-sm text-muted-foreground font-bold'>Users online: {usersOnline}</p>
                    </div>
                </div>
            )}

            <ExpandableProfileCard />

            <Toaster id='room-code-copied-toast' />
        </div>
    )
}
