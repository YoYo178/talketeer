import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { BannedDialog } from '@/components/chat/rooms/dialogs/info/BannedDialog'
import { KickedDialog } from '@/components/chat/rooms/dialogs/info/KickedDialog'
import { RoomDeletedDialog } from '@/components/chat/rooms/dialogs/info/RoomDeletedDialog'
import { NavBar } from '@/components/NavBar'
import { useMe } from '@/hooks/network/users/useGetMeQuery'
import { useSocketConnection } from '@/hooks/socket/useSocketConnection'
import { useRoomsStore } from '@/hooks/state/useRoomsStore'
import { useMediaQuery } from '@/hooks/ui/useMediaQuery'
import { useEffect } from 'react'

// TODO: Fix ChatSidebar for smaller screens!

export const UserLayout = () => {
    const { dmRoomId, selectedRoomId, joinedRoomId, setJoinedRoomId } = useRoomsStore()
    const me = useMe()
    const isMobile = useMediaQuery('(max-width: 767px)')

    useEffect(() => {
        if (me)
            setJoinedRoomId(me.room ?? null)
    }, [me?.room])

    useSocketConnection()

    const showSidebar = !isMobile || (!selectedRoomId && !joinedRoomId && !dmRoomId)
    const isDMActive = Boolean(dmRoomId)
    const hasRoom = joinedRoomId || selectedRoomId || isDMActive

    return (
        <div className="flex flex-col gap-3 h-[calc(100svh-1.5rem)] w-[calc(100vw-1.5rem)] m-3">
            <NavBar />

            <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-auto">
                {showSidebar && <ChatSidebar />}

                <div className='flex-1 flex flex-col md:flex-row gap-3 overflow-auto relative'>
                    {!hasRoom ? (
                        <div className="flex-1 bg-background p-6 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-base md:text-lg font-semibold mb-1">
                                    Join a room to get started!
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground">
                                    Select a room {isMobile ? 'from above' : 'on the left'} or create a new one.
                                </div>
                            </div>
                        </div>
                    ) : (<ChatWindow />)}

                </div>
            </div>

            <KickedDialog />
            <BannedDialog />
            <RoomDeletedDialog />
        </div>
    )
}