import type { IUser } from '@/types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { type FC, useState } from 'react';
import { Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../ui/dropdown-menu';
import { useSettingsStore } from '@/hooks/state/useSettingsStore';

interface ExpandableProfileCardProps {
    user: IUser | undefined;
}

export const ExpandableProfileCard: FC<ExpandableProfileCardProps> = ({ user }) => {
    const [isCardOpen, setIsCardOpen] = useState(true);
    const [hasCardTransitionFinished, setHasCardTransitionFinished] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { isDark, setIsDark } = useSettingsStore();

    const handleAvatarClick = () => {
        setIsCardOpen(!isCardOpen);
        setHasCardTransitionFinished(false);
    }

    const handleToggleTheme = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        setIsDark(!isDark);
    }

    return (
        <div
            className={
                'flex gap-2 items-center overflow-hidden rounded-full outline-1 outline-muted-foreground transition-all duration-800 ease-out origin-left max-h-14 ' +
                `${isCardOpen ? 'w-64' : 'w-14'}`
            }
        >
            <Avatar
                className={
                    'cursor-pointer size-14 shrink-0 transition-all duration-800 ease-out ' +
                    `${isCardOpen ? 'rotate-[360deg]' : 'rotate-0'}`
                }
                onClick={handleAvatarClick}
                onTransitionEnd={() => setHasCardTransitionFinished(true)}
            >
                <AvatarImage src={user?.avatarURL} />
                <AvatarFallback>{user?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
            </Avatar>

            <div className={
                'transition-all duration-500' +
                    isCardOpen ? 'opacity-100' : 'opacity-0'
            }>
                <h2 className={`text-sm font-semibold leading-tight ${isCardOpen && hasCardTransitionFinished ? '' : 'text-nowrap'}`}>
                    {user?.displayName}
                </h2>
                <p className={`text-xs text-muted-foreground leading-tight ${isCardOpen && hasCardTransitionFinished ? '' : 'text-nowrap'}`}>
                    @{user?.username}
                </p>
            </div>

            <DropdownMenu open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DropdownMenuTrigger className='ml-auto mr-4 flex focus:outline-none'>
                    <Settings
                        className={
                            'cursor-pointer min-w-6 size-6 transition-all duration-800 ease-out ' +
                            `${isSettingsOpen ? 'rotate-180' : 'rotate-0'}`
                        }
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
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
                    <DropdownMenuItem onClick={handleToggleTheme}>Toggle theme</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
