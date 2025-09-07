import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation'
import ToggleThemeButton from './scheme/theme-button'
import { Button } from './ui/button'
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, MessagesSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import type { IUser } from '@/types/user.types';

export const NavBar = () => {
    const { data } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const user: IUser | undefined = data?.data.user;
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
        <div className='flex items-center bg-(--color-primary-foreground) p-5 rounded-xl'>

            <div className='flex gap-2 items-center'>
                <MessagesSquare className='size-8' />
            <h1 className='text-2xl font-bold'>Talketeer</h1>
            </div>

            {/* temporary, until i come up with a proper layout and a proper place */}
            <div className='flex justify-center ml-40 gap-4 relative'>
                <Avatar className='outline-1 outline-muted-foreground size-12'>
                    <AvatarImage src={user?.avatarURL} />
                    <AvatarFallback>{user?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>

                <div className='flex flex-col mt-[0.1rem]'>
                    <p className='text-primary text-l font-bold relative'>{user?.displayName}</p>
                    <p className='absolute text-muted-foreground text-sm translate-y-5'>@{user?.username}</p>
                </div>
            </div>

            <div className='ml-auto flex gap-3'>
                <ToggleThemeButton />
                <Button className='ml-auto' onClick={handleLogout}><LogOut />Log out</Button>
            </div>

        </div>
    )
}
