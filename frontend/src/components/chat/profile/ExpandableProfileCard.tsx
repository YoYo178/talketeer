import type { IUser } from '@/types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useState } from 'react';
import { SettingsButton } from './SettingsButton';
import { NotificationsButton } from './NotificationsButton';
import { useMe } from '@/hooks/network/users/useGetMeQuery';

export const ExpandableProfileCard = () => {
    const [isCardOpen, setIsCardOpen] = useState(true);
    const [hasCardTransitionFinished, setHasCardTransitionFinished] = useState(false);

    const me: IUser | undefined = useMe();

    const handleAvatarClick = () => {
        setIsCardOpen(!isCardOpen);
        setHasCardTransitionFinished(false);
    }

    return (
        <div
            className={
                'flex gap-2 overflow-hidden items-center rounded-full outline-2 outline-primary transition-[width] duration-800 ease-out origin-left max-h-14 ' +
                `${isCardOpen ? 'w-72' : 'w-14'}`
            }
        >
            <Avatar
                className={
                    'cursor-pointer size-14 shrink-0 transition-[rotate] duration-800 ease-out ' +
                    `${isCardOpen ? 'rotate-[360deg]' : 'rotate-0'}`
                }
                onClick={handleAvatarClick}
                onTransitionEnd={() => setHasCardTransitionFinished(true)}
            >
                <AvatarImage src={me?.avatarURL} />
                <AvatarFallback>{me?.displayName.split(' ').map(str => str[0].toUpperCase()).join('')}</AvatarFallback>
            </Avatar>

            <div className={
                'flex-1 flex transition-[opacity,visibility] duration-500 ' +
                (isCardOpen ? 'opacity-100 visible' : 'opacity-0 invisible')
            }>
                <div className="flex flex-col">
                    <h2 className={`text-sm font-semibold leading-tight ${isCardOpen && hasCardTransitionFinished ? '' : 'text-nowrap'}`}>
                        {me?.displayName}
                    </h2>
                    <p className={`text-xs text-muted-foreground leading-tight ${isCardOpen && hasCardTransitionFinished ? '' : 'text-nowrap'}`}>
                        @{me?.username}
                    </p>

                </div>

                <div className="flex items-center ml-auto mr-4 gap-2">
                    <NotificationsButton />
                    <SettingsButton />
                </div>
            </div>

        </div>
    )
}
