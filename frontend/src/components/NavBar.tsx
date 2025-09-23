import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation'
import { Button } from './ui/button'
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, MessagesSquare } from 'lucide-react';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';
import { useGlobalStore } from '@/hooks/state/useGlobalStore';
import { ExpandableProfileCard } from './chat/profile/ExpandableProfileCard';

export const NavBar = () => {
    const { membersOnline } = useGlobalStore();

    const queryClient = useQueryClient();

    const logoutMutation = useLogoutMutation({ queryKey: ['auth'] });

    const hideTitle = useMediaQuery('(max-width: 590px)');
    const hideLogoutText = useMediaQuery('(max-width: 465px)');
    const hideName = useMediaQuery('(max-width: 395px)');

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync({});

            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (e: any) {
            console.error('An error occured while logging out!')
            console.error(e?.message || e);
        }
    }

    return (
        <div className='flex items-center bg-accent dark:bg-primary-foreground rounded-xl'>

            <div className='flex gap-2 p-5'>
                <MessagesSquare className='size-8' />
                {(!hideTitle || hideTitle && hideName) && (
                    <div className="flex flex-col">
                        <h1 className='text-2xl font-bold'>Talketeer</h1>
                        <p className='text-sm text-muted-foreground font-bold'>Users online: {membersOnline}</p>
                    </div>
                )}
            </div>

            <div className='flex-1 flex items-center justify-end gap-3 px-5'>

                <ExpandableProfileCard />
                <Button className='' onClick={handleLogout}>
                    <LogOut />
                    {!hideLogoutText && <>Log out</>}
                </Button>
            </div>

        </div>
    )
}
