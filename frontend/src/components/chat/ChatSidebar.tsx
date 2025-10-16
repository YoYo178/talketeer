import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRooms } from '@/hooks/network/rooms/useGetRoomsQuery'
import { RoomList } from './rooms/RoomList'
import { CreateRoomDialog } from './rooms/dialogs/CreateRoomDialog'
import { JoinRoomDialog } from './rooms/dialogs/JoinRoomDialog'
import { ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react'
import { useMediaQuery } from '@/hooks/ui/useMediaQuery'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { FriendList } from './friends/FriendList'
import { useMe } from '@/hooks/network/users/useGetMeQuery'

export const ChatSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHoveringOnArrow, setIsHoveringOnArrow] = useState(false);

    const [searchText, setSearchText] = useState('')

    const rooms = useRooms();
    const me = useMe();

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
            <Tabs
                defaultValue='rooms'
                className='flex rounded-xl bg-accent dark:bg-primary-foreground p-3'
            >
                <TabsList className='w-full'>
                    <TabsTrigger value='rooms' className='cursor-pointer text-xs'>Rooms</TabsTrigger>
                    <TabsTrigger value='friends' className='cursor-pointer text-xs'>Friends</TabsTrigger>
                </TabsList>

                {/* Rooms list tab */}
                <TabsContent value='rooms' className='min-h-[300px] flex flex-col gap-3 overflow-hidden'>
                    <div className='flex gap-2'>
                        <CreateRoomDialog />
                        <JoinRoomDialog />
                    </div>

                    <Input
                        className='text-sm font-medium'
                        placeholder='Search rooms…'
                        autoComplete='off'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <RoomList rooms={filteredRooms} />
                </TabsContent>

                {/* Friends list tab */}
                <TabsContent value='friends' className='min-h-[300px] flex flex-col mb-3 gap-3 overflow-hidden'>
                    <FriendList friends={me?.friends || []} />
                </TabsContent>
            </Tabs>
        )
    }

    return (
        <div className={`flex rounded-xl bg-accent dark:bg-primary-foreground transition-[padding-inline] duration-300 ${isCollapsed ? '' : 'pl-3'}`}>
            <Tabs defaultValue='rooms' className={`w-72 transition-[opacity,max-width] duration-300 ${isCollapsed ? 'opacity-0 max-w-0 invisible' : 'opacity-100 max-w-72 visible'}`}>
                <TabsList className='w-full mb-2 mt-3'>
                    <TabsTrigger value='rooms' className='cursor-pointer'>Rooms</TabsTrigger>
                    <TabsTrigger value='friends' className='cursor-pointer'>Friends</TabsTrigger>
                </TabsList>

                {/* Rooms list tab */}
                <TabsContent value='rooms' className={`flex flex-col mb-3 gap-3 overflow-hidden transition-[opacity,max-width] duration-300 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-72'}`}>
                    <div className='flex gap-2'>
                        <CreateRoomDialog />
                        <JoinRoomDialog />
                    </div>

                    <Input
                        placeholder='Search rooms…'
                        autoComplete='off'
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />

                    <RoomList rooms={filteredRooms} />
                </TabsContent>

                {/* Friends list tab */}
                <TabsContent value='friends' className={`flex flex-col mb-3 gap-3 overflow-hidden transition-[opacity,max-width] duration-300 ${isCollapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-72'}`}>
                    <FriendList friends={me?.friends || []} />
                </TabsContent>
            </Tabs>

            <button
                className={`h-full w-0 px-1.5 cursor-pointer flex flex-col items-center justify-center transition-[padding-inline] ${isHoveringOnArrow ? 'px-3' : ''}`}
                onMouseOver={() => setIsHoveringOnArrow(true)}
                onMouseOut={() => setIsHoveringOnArrow(false)}
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? (
                    <ArrowRightFromLine
                        className={`transition-[opacity] duration-100 text-muted-foreground size-4 ${isHoveringOnArrow ? 'opacity-100' : 'opacity-0'}`}
                    />
                ) : (
                    <ArrowLeftFromLine
                        className={`transition-[opacity] duration-100 text-muted-foreground size-4 ${isHoveringOnArrow ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}
            </button>
        </div>
    )
}
