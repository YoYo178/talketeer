import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetRoomsQuery } from '@/hooks/network/rooms/useGetRoomsQuery'
import type { IRoom } from '@/types/room.types'
import type { FC } from 'react'
import { RoomList } from './rooms/RoomList'

interface ChatSidebarProps {
    onSelectRoom: (room: IRoom | null) => void;
    selectedRoom: IRoom | null
}

export const ChatSidebar: FC<ChatSidebarProps> = ({ onSelectRoom, selectedRoom }) => {
    const [searchText, setSearchText] = useState('')
    const { data } = useGetRoomsQuery({ queryKey: ['rooms'] })

    const rooms: IRoom[] = data?.data?.rooms || []

    const filteredRooms = useMemo(() => {
        const term = searchText.trim().toLowerCase()
        if (!term) return rooms
        return rooms.filter(r => r.name.toLowerCase().includes(term))
    }, [rooms, searchText])

    return (
        <div className='w-full md:w-64 lg:w-72 bg-card m-3 p-3 rounded-xl flex flex-col gap-3'>
            <div className='flex gap-2'>
                <Input placeholder='Search rooms…' value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <Button className='whitespace-nowrap'>New room</Button> {/* TODO: functionality */}
            </div>

            <RoomList rooms={filteredRooms} onSelectRoom={onSelectRoom} selectedRoom={selectedRoom} />
        </div>
    )
}
