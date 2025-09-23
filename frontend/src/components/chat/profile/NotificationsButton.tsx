import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NotificationList } from './NotificationList';
import { useGlobalStore } from '@/hooks/state/useGlobalStore';

export const NotificationsButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { hasNewNotifications, setHasNewNotifications } = useGlobalStore();
    useEffect(() => setHasNewNotifications(false), [isOpen]);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <div className='relative'>
                    <Bell
                        className='cursor-pointer min-w-6 size-6 transition-all duration-800 ease-out'
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    {hasNewNotifications && (<div className='absolute top-0 right-0 rounded-full size-2 bg-red-600 outline-2 outline-primary' />)}
                </div>
            </PopoverTrigger>
            <PopoverContent
                align='end'
                side='bottom'
                alignOffset={10}
                sideOffset={10}
                asChild
            >
                <div className='flex flex-col items-center min-h-[400px] min-w-[350px] max-h-[400px] max-w-[350px]'>
                    <Label className='text-md mb-4'>Notifications</Label>
                    <NotificationList />
                </div>
            </PopoverContent>
        </Popover>
    )
}
