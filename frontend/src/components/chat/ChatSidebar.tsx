import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRooms } from '@/hooks/network/rooms/useGetRoomsQuery'
import { RoomList } from './rooms/RoomList'
import { CreateRoomDialog } from './rooms/dialogs/CreateRoomDialog'
import { JoinRoomDialog } from './rooms/dialogs/JoinRoomDialog'
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import { useMediaQuery } from '@/hooks/ui/useMediaQuery'

export const ChatSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHoveringOnArrow, setIsHoveringOnArrow] = useState(false);

    const [searchText, setSearchText] = useState('')

    const rooms = useRooms();

    const filteredRooms = useMemo(() => {
        const term = searchText.trim().toLowerCase()
        if (!term) return rooms
        return rooms.filter(r => r.name.toLowerCase().includes(term))
    }, [rooms, searchText])

    // Detect if we're below md breakpoint (768px)
    const isMobile = useMediaQuery('(max-width: 767px)');

    // can't be bothered to add like hundreds of more conditionals to the main return block
    if (isMobile) {
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

    return (
        <div className={`flex flex-col p-3 pr-0 rounded-xl bg-accent dark:bg-primary-foreground transition-all duration-300 ${isCollapsed ? 'px-1' : ''}`}>
            <div className="flex h-full">
                <div className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-72'}`}>
                    <div className='w-72 flex gap-2'>
                        <CreateRoomDialog />
                        <JoinRoomDialog />
                    </div>

                    <Input
                        placeholder='Search rooms…'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <RoomList rooms={filteredRooms} />
                </div>

                <button
                    className={`h-full w-3 px-1.5 cursor-pointer flex flex-col items-center justify-center transition-all ${isHoveringOnArrow ? 'px-3' : ''}`}
                    onMouseOver={() => setIsHoveringOnArrow(true)}
                    onMouseOut={() => setIsHoveringOnArrow(false)}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? (
                        <ArrowRightFromLine
                            className={`transition-all duration-100 text-muted-foreground size-4 ${isHoveringOnArrow ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ) : (
                        <ArrowLeftFromLine
                            className={`transition-all duration-100 text-muted-foreground size-4 ${isHoveringOnArrow ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}
                </button>
            </div>
        </div>
    )
}
