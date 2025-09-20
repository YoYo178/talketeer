import { NotificationEntry } from "./NotificationEntry"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/network/notifications/useGetNotificationsQuery";
import { useMemo } from "react";

export const NotificationList = () => {
    const notifications = useNotifications() || [];

    const sortedNotifications = useMemo(
        () => notifications.sort((a, b) => new Date(b.createdAt || '').valueOf() - new Date(a.createdAt || '').valueOf()),
        [notifications]
    )

    return (
        <>
            {!notifications.length ? (
                <div className='flex-1 flex flex-col overflow-x-hidden overflow-y-auto w-full'>
                    <p className='text-lg text-muted-foreground text-center m-auto'>You're all caught up!</p>
                </div>
            ) : (
                <ScrollArea className='flex-1 flex flex-col overflow-x-hidden overflow-y-auto w-full'>
                    {sortedNotifications.map(notObj => (<NotificationEntry notification={notObj} />))}
                </ScrollArea>
            )}
        </>
    )
}
