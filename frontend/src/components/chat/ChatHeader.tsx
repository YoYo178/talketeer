import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation'
import ToggleThemeButton from '../scheme/theme-button'
import { Button } from '../ui/button'
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, MessagesSquare } from 'lucide-react';

export const ChatHeader = () => {
    const queryClient = useQueryClient();

    const logoutMutation = useLogoutMutation({ queryKey: ['auth'] });

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
        <div className='flex bg-(--color-primary-foreground) p-5 rounded-xl'>

            <div className='flex gap-2 items-center'>
                <MessagesSquare className='size-8' />
                <h1 className='text-2xl font-bold'>Talketeer</h1>
            </div>

            <div className='ml-auto flex gap-3'>
                <ToggleThemeButton />
                <Button className='ml-auto' onClick={handleLogout}><LogOut />Log out</Button>
            </div>

        </div>
    )
}
