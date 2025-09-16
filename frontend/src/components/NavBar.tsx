import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation'
import { ToggleThemeButton } from './scheme/theme-button'
import { Button } from './ui/button'
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, MessagesSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import type { IUser } from '@/types/user.types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';
import { useGlobalStore } from '@/hooks/state/useGlobalStore';

export const NavBar = () => {
    const { membersOnline } = useGlobalStore();

    const queryClient = useQueryClient();
    const me: IUser | undefined = useMe();

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
        <div className='flex items-center bg-(--color-primary-foreground) p-5 rounded-xl overflow-hidden'> {/* temp!! */}

            <div className='flex gap-2'>
                <MessagesSquare className='size-8' />
                {(!hideTitle || hideTitle && hideName) && (
                    <div className="flex flex-col">
                        <h1 className='text-2xl font-bold'>Talketeer</h1>
                        <p className='text-sm text-muted-foreground font-bold'>Users online: {membersOnline}</p>
                    </div>
                )}
            </div>

            {/* temporary, until i come up with a proper layout and a proper place */}
            <div className='flex flex-1 mx-4 justify-center gap-4 relative'>
                <Avatar className='outline-1 outline-muted-foreground size-12'>
                    <AvatarImage src={me?.avatarURL} />
                    <AvatarFallback>{me?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
                </Avatar>
                {!hideName && (
                    <div className='flex flex-col mt-[0.1rem]'>
                        <p className='text-primary text-l font-bold'>{me?.displayName}</p>
                        <p className='text-muted-foreground text-sm -translate-y-1'>@{me?.username}</p>
                    </div>
                )}
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
                <Button className='ml-auto' onClick={handleLogout}>
                    <LogOut />
                    {!hideLogoutText && <>Log out</>}
                </Button>
            </div>

        </div>
    )
}
