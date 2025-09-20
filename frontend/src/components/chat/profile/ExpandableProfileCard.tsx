import type { IUser } from '@/types/user.types';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { type FC, useState } from 'react';
import { SettingsButton } from './SettingsButton';
import { NotificationsButton } from './NotificationsButton';

interface ExpandableProfileCardProps {
    user: IUser | undefined;
}

export const ExpandableProfileCard: FC<ExpandableProfileCardProps> = ({ user }) => {
    const [isCardOpen, setIsCardOpen] = useState(true);
    const [hasCardTransitionFinished, setHasCardTransitionFinished] = useState(false);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const handleAvatarClick = () => {
        setIsCardOpen(!isCardOpen);
        setHasCardTransitionFinished(false);

        if (isSettingsOpen)
            setIsSettingsOpen(false);

        if (isNotificationsOpen)
            setIsNotificationsOpen(false);
    }

    return (
        <div
            className={
                'flex gap-2 overflow-hidden items-center rounded-full outline-1 outline-muted-foreground transition-all duration-800 ease-out origin-left max-h-14 ' +
                `${isCardOpen ? 'w-72' : 'w-14'}`
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
                'flex-1 flex transition-all duration-500 ' +
                (isCardOpen ? 'opacity-100 visible' : 'opacity-0 invisible')
            }>
                <div className="flex flex-col">
                    <h2 className={`text-sm font-semibold leading-tight ${isCardOpen && hasCardTransitionFinished ? '' : 'text-nowrap'}`}>
                        {user?.displayName}
                    </h2>
                    <p className={`text-xs text-muted-foreground leading-tight ${isCardOpen && hasCardTransitionFinished ? '' : 'text-nowrap'}`}>
                        @{user?.username}
                    </p>

                </div>

                <div className="flex items-center ml-auto mr-4 gap-2">
                    <NotificationsButton isOpen={isNotificationsOpen} onOpenChange={(state) => {
                        if (isSettingsOpen)
                            setIsSettingsOpen(false);

                        setIsNotificationsOpen(state);
                    }} />
                    <SettingsButton isOpen={isSettingsOpen} onOpenChange={(state) => {
                        if (isNotificationsOpen)
                            setIsNotificationsOpen(false);

                        setIsSettingsOpen(state);
                    }} />
                </div>
            </div>

        </div>
    )
}
