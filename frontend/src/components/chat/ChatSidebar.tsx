import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRooms } from '@/hooks/network/rooms/useGetRoomsQuery'
import { RoomList } from './rooms/RoomList'
import { CreateRoomDialog } from './rooms/dialogs/CreateRoomDialog'
import { JoinRoomDialog } from './rooms/dialogs/JoinRoomDialog'

export const ChatSidebar = () => {
    const [searchText, setSearchText] = useState('')

    const rooms = useRooms();

    const filteredRooms = useMemo(() => {
        const term = searchText.trim().toLowerCase()
        if (!term) return rooms
        return rooms.filter(r => r.name.toLowerCase().includes(term))
    }, [rooms, searchText])

    return (
        <div className='flex flex-col gap-3 w-full md:w-72 p-3 rounded-xl bg-accent dark:bg-primary-foreground'>
            <div className='flex gap-2 max-w-full'>
                <CreateRoomDialog />
                <JoinRoomDialog />
            </div>

            <Input placeholder='Search rooms…' value={searchText} onChange={(e) => setSearchText(e.target.value)} />

            <RoomList rooms={filteredRooms} />
        </div>
    )
}
