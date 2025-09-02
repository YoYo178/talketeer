import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { NavBar } from '@/components/NavBar'
import { useState } from 'react'

export const UserLayout = () => {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-3 h-[calc(100vh-1.5rem)] w-[calc(100vw - 1.5rem)] m-3">
            <NavBar />

            <div className="flex-1 flex gap-3 overflow-auto"> {/* this 'h-0' is very necessary, just don't ask why */}
                <ChatSidebar
                    onSelectRoomId={setSelectedRoomId}
                    selectedRoomId={selectedRoomId}
                />
                <ChatWindow
                    onSelectRoomId={setSelectedRoomId}
                    selectedRoomId={selectedRoomId}
                />
            </div>
        </div>
    )
}
