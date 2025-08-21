import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetRoomsQuery } from '@/hooks/network/rooms/useGetRoomsQuery'
import type { IRoom } from '@/types/room.types'
import type { FC } from 'react'

interface ChatSidebarProps {
    onSelectRoom: (room: IRoom | null) => void;
    selectedRoomId: string | null
}

export const ChatSidebar: FC<ChatSidebarProps> = ({ onSelectRoom, selectedRoomId }) => {
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
                <Button className='whitespace-nowrap'>New room</Button>
            </div>

            <div className='flex-1 overflow-y-auto rounded-md border border-border/40 divide-y divide-border/40'>
                {filteredRooms.length === 0 && (
                    <div className='p-3 text-sm text-muted-foreground'>No rooms found</div>
                )}
                {filteredRooms.map(room => (
                    <button
                        key={room._id}
                        onClick={() => onSelectRoom(room)}
                        className={`w-full text-left p-3 hover:bg-accent/40 ${selectedRoomId === room._id ? 'bg-accent/60' : ''}`}
                    >
                        <div className='flex items-center gap-2'>
                            <div className='font-medium'>{room.name}</div>
                            {room.isSystemGenerated && (
                                <span className='text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-foreground text-primary-foreground font-bold'>SYSTEM</span>
                            )}
                        </div>
                        <div className='text-xs text-muted-foreground'>Members: {room.currentMemberCount}/{room.memberLimit}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}
