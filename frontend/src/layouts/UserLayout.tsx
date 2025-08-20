import { ChatHeader } from '@/components/chat/ChatHeader'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useState } from 'react'
import type { IRoom } from '@/types/room.types'

export const UserLayout = () => {
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)

    return (
        <>
            <ChatHeader />
            <div className='flex flex-col md:flex-row h-screen'>
                <ChatSidebar onSelectRoom={setSelectedRoom} selectedRoomId={selectedRoom?._id || null} />
                <ChatWindow selectedRoom={selectedRoom} />
            </div>
        </>
    )
}
