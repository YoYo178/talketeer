import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetRoomsQuery } from '@/hooks/network/rooms/useGetRoomsQuery'
import type { IRoom } from '@/types/room.types'
import type { FC } from 'react'
import { RoomList } from './rooms/RoomList'
import { HousePlus, Plus } from 'lucide-react'

interface ChatSidebarProps {
    onSelectRoomId: (roomId: string | null) => void;
    selectedRoomId: string | null
}

export const ChatSidebar: FC<ChatSidebarProps> = ({ onSelectRoomId, selectedRoomId }) => {
    const [searchText, setSearchText] = useState('')
    const { data } = useGetRoomsQuery({ queryKey: ['rooms'] })

    const rooms: IRoom[] = data?.data?.rooms || []

    const filteredRooms = useMemo(() => {
        const term = searchText.trim().toLowerCase()
        if (!term) return rooms
        return rooms.filter(r => r.name.toLowerCase().includes(term))
    }, [rooms, searchText])

    return (
        <div className='flex flex-col gap-3 w-72 p-3 rounded-xl bg-card'>
            <div className='flex gap-2 max-w-full'>
                <Button className='flex-1 whitespace-nowrap'><Plus className='size-5' />New room</Button> {/* TODO: functionality */}
                <Button className='flex-1 whitespace-nowrap'><HousePlus className='size-5' />Join room</Button> {/* TODO: functionality */}
            </div>

            <Input placeholder='Search rooms…' value={searchText} onChange={(e) => setSearchText(e.target.value)} />

            <RoomList rooms={filteredRooms} onSelectRoomId={onSelectRoomId} selectedRoomId={selectedRoomId} />
        </div>
    )
}
