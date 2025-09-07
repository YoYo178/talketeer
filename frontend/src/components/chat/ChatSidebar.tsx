import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useGetRoomsQuery } from '@/hooks/network/rooms/useGetRoomsQuery'
import type { IRoomPublicView } from '@/types/room.types'
import type { FC } from 'react'
import { RoomList } from './rooms/RoomList'
import { CreateRoomDialog } from './rooms/dialogs/CreateRoomDialog'
import { JoinRoomDialog } from './rooms/dialogs/JoinRoomDialog'

interface ChatSidebarProps {
    onSelectRoomId: (roomId: string | null) => void;
    selectedRoomId: string | null
}

export const ChatSidebar: FC<ChatSidebarProps> = ({ onSelectRoomId, selectedRoomId }) => {
    const [searchText, setSearchText] = useState('')
    const { data } = useGetRoomsQuery({ queryKey: ['rooms'] })

    const rooms: IRoomPublicView[] = data?.data?.rooms || []

    const filteredRooms = useMemo(() => {
        const term = searchText.trim().toLowerCase()
        if (!term) return rooms
        return rooms.filter(r => r.name.toLowerCase().includes(term))
    }, [rooms, searchText])

    return (
        <div className='flex flex-col gap-3 w-full md:w-72 p-3 rounded-xl bg-card'>
            <div className='flex gap-2 max-w-full'>
                <CreateRoomDialog />
                <JoinRoomDialog onSelectRoomId={onSelectRoomId} selectedRoomId={selectedRoomId}/>
            </div>

            <Input placeholder='Search rooms…' value={searchText} onChange={(e) => setSearchText(e.target.value)} />

            <RoomList rooms={filteredRooms} onSelectRoomId={onSelectRoomId} selectedRoomId={selectedRoomId} />
        </div>
    )
}
