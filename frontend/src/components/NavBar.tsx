import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation'
import { ToggleThemeButton } from './scheme/theme-button'
import { Button } from './ui/button'
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, MessagesSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import type { IUser } from '@/types/user.types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export const NavBar = () => {
    const queryClient = useQueryClient();
    const me: IUser | undefined = useMe();

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
        <div className='flex items-center bg-(--color-primary-foreground) p-5 rounded-xl overflow-hidden'> {/* temp!! */}

            <div className='flex gap-2 items-center'>
                <MessagesSquare className='size-8' />
                <h1 className='text-2xl font-bold'>Talketeer</h1>
            </div>

            {/* temporary, until i come up with a proper layout and a proper place */}
            <div className='flex flex-1 justify-center gap-4 relative'>
                <Avatar className='outline-1 outline-muted-foreground size-12'>
                    <AvatarImage src={me?.avatarURL} />
                    <AvatarFallback>{me?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>

                <div className='flex flex-col mt-[0.1rem]'>
                    <p className='text-primary text-l font-bold'>{me?.displayName}</p>
                    <p className='text-muted-foreground text-sm -translate-y-1'>@{me?.username}</p>
                </div>
            </div>

            <div className='ml-auto flex gap-3'>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <ToggleThemeButton />
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                        <p>Toggle theme</p>
                    </TooltipContent>
                </Tooltip>
                <Button className='ml-auto' onClick={handleLogout}><LogOut />Log out</Button>
            </div>

        </div>
    )
}
