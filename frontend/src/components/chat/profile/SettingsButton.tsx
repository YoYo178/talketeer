import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/hooks/network/auth/useLogoutMutation';
import { useSettingsStore } from '@/hooks/state/useSettingsStore';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Moon, Settings, Sun } from 'lucide-react'
import { useState } from 'react';

export const SettingsButton = () => {
    const queryClient = useQueryClient();

    const [isOpen, setIsOpen] = useState(false);
    const { isDark, setIsDark } = useSettingsStore();

    const handleToggleTheme = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        setIsDark(!isDark);
    }

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
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className='focus:outline-none'>
                <Settings
                    className={
                        'cursor-pointer min-w-6 size-6 transition-[rotate] duration-800 ease-out ' +
                        `${isOpen ? 'rotate-180' : 'rotate-0'}`
                    }
                    onClick={() => setIsOpen(!isOpen)}
                >
                </Settings>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side='bottom'
                align='end'
                sideOffset={12}
                alignOffset={20}
                className='[&>*]:cursor-pointer'
            >
                <DropdownMenuItem onClick={handleToggleTheme}>
                    {isDark ? <Sun /> : <Moon />}
                    Toggle theme
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
