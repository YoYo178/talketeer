import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useState } from 'react'
import type { IRoom } from '@/types/room.types'

export const UserLayout = () => {
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)

    return (
        <div className="flex flex-col h-screen">
            <ChatHeader />

            <div className="flex flex-col md:flex-row flex-1 h-0"> {/* this 'h-0' is very necessary, just don't ask why */}
                <ChatSidebar
                    onSelectRoom={setSelectedRoom}
                    selectedRoom={selectedRoom}
                />
                <ChatWindow
                    onSelectRoom={setSelectedRoom}
                    selectedRoom={selectedRoom}
                />
            </div>
        </div>
    )
}
