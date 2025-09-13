import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { BannedDialog } from '@/components/chat/rooms/dialogs/info/BannedDialog'
import { KickedDialog } from '@/components/chat/rooms/dialogs/info/KickedDialog'
import { RoomDeletedDialog } from '@/components/chat/rooms/dialogs/info/RoomDeletedDialog'
import { NavBar } from '@/components/NavBar'
import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery'
import { useSocketConnection } from '@/hooks/socket/useSocketConnection'
import { useMediaQuery } from '@/hooks/ui/useMediaQuery'
import { useEffect, useState } from 'react'

export const UserLayout = () => {
    const { data } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const userRoomId = data?.data?.user.room ?? null;
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    // Initialize socket connection
    useSocketConnection();

    useEffect(() => {
        setSelectedRoomId(userRoomId);
    }, [userRoomId]);

    // Detect if we're below md breakpoint (768px)
    const isMobile = useMediaQuery('(max-width: 767px)');

    return (
        <div className="flex flex-col gap-3 h-[calc(100vh-1.5rem)] w-[calc(100vw - 1.5rem)] m-3">
            <NavBar />

            <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-auto"> {/* this 'h-0' is very necessary, just don't ask why */}
                {isMobile ? (
                    <>
                        {!selectedRoomId && (
                            <ChatSidebar
                                onSelectRoomId={setSelectedRoomId}
                                selectedRoomId={selectedRoomId}
                            />
                        )}
                    </>
                ) : (
                    <ChatSidebar
                        onSelectRoomId={setSelectedRoomId}
                        selectedRoomId={selectedRoomId}
                    />
                )}
                <ChatWindow
                    onSelectRoomId={setSelectedRoomId}
                    selectedRoomId={selectedRoomId}
                />
            </div>

            <KickedDialog />
            <BannedDialog />
            <RoomDeletedDialog />
        </div>
    )
}
