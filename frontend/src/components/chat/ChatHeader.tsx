import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation'
import ToggleThemeButton from '../scheme/theme-button'
import { Button } from '../ui/button'
import { useQueryClient } from '@tanstack/react-query';

export const ChatHeader = () => {
    const queryClient = useQueryClient();

    const logoutMutation = useLogoutMutation({ queryKey: ['auth'] });

    const handleLogout = async () => {
        await logoutMutation.mutateAsync({});

        if (logoutMutation.isSuccess)
            queryClient.invalidateQueries({ queryKey: ['users'] });
    }

    return (
        <div className='flex w-[calc(100%-1.5rem)] bg-(--color-primary-foreground) m-3 mb-0 p-5 rounded-xl'>
            <h1 className='text-2xl font-bold'>Talketeer</h1>
            <div className='ml-auto flex gap-3'>
                <ToggleThemeButton />
                <Button className='ml-auto' onClick={handleLogout}>Log out</Button>
            </div>
        </div>
    )
}
