import { CircleQuestionMark, DoorClosed, DoorClosedLocked, DoorOpen, Handshake, Info, Trash2, UserMinus, UserPlus } from 'lucide-react'
import type { FC, ReactNode } from 'react'
import ms from 'ms';
import type { INotification, INotificationType } from '@/types/notification.types';

const iconsMap: { [K in INotificationType]: ReactNode } = {
    'friend-request': <UserPlus />,
    'friend-new': <Handshake />,
    'friend-delete': <UserMinus />,

    'room-invite': <DoorOpen />,
    'room-ban': <DoorClosedLocked />,
    'room-kick': <DoorClosed />,
    'room-delete': <Trash2 />,

    'system': <Info />,
    'unknown': <CircleQuestionMark />
}

interface NotificationEntryProps {
    notification: INotification
}

export const NotificationEntry: FC<NotificationEntryProps> = ({ notification }) => {
    return (
        <div className='flex items-center hover:bg-accent mx-2 px-2 py-1'>
            {iconsMap[notification.type] || iconsMap['unknown']}
            <span className='w-full text-sm mx-2 whitespace-pre-wrap wrap-anywhere'>{notification.content}</span>

            {notification.createdAt && (
                <span className='text-xs text-muted-foreground self-end'>
                    {ms(Date.now() - (new Date(notification.createdAt).valueOf()))}
                </span>
            )}
        </div>
    )
}
