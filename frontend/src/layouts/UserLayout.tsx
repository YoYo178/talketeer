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
    const { selectedRoomId, joinedRoomId, setJoinedRoomId } = useRoomsStore();

    // Keep our room status updated!
    const me = useMe();
    const roomId = me?.room ?? null;
    useEffect(() => {
        if (!me)
            return;

        setJoinedRoomId(roomId)
    }, [roomId]);

    // Initialize socket connection
    useSocketConnection();

    // Detect if we're below md breakpoint (768px)
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <div className="flex flex-col gap-3 h-[calc(100svh-1.5rem)] w-[calc(100vw-1.5rem)] m-3">
            <NavBar />

            <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-auto"> {/* this 'h-0' is very necessary, just don't ask why */}
                {
                    (!isMobile || !selectedRoomId && !joinedRoomId) && (<ChatSidebar />)
                }
                {joinedRoomId || selectedRoomId
                    ? (<ChatWindow />)
                    : (
                        <div className='flex-1 bg-background p-6 flex items-center justify-center'>
                            <div className='text-center'>
                                <div className='text-base md:text-lg font-semibold mb-1'>Join a room to get started!</div>
                                <div className='text-xs md:text-sm text-muted-foreground'>Select a room {isMobile ? 'from above' : 'on the left'} or create a new one.</div>
                            </div>
                        </div>
                    )}
            </div>

            <KickedDialog />
            <BannedDialog />
            <RoomDeletedDialog />
        </div>
    )
}
