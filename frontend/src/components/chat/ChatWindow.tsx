import { useLayoutEffect, useState } from 'react'
import { ChatComposer } from './rich-text/ChatComposer';
import { MessageList } from './messages/MessageList';
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { ChatHeader } from './ChatHeader';
import { Separator } from '../ui/separator';
import { useMediaQuery } from '@/hooks/ui/useMediaQuery';
import { ArrowLeft } from 'lucide-react';
import { RoomMemberList } from './rooms/RoomMemberList';
import { ChatButton } from './rich-text/utility/ChatButton';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';

export const ChatWindow = () => {
    const [isInMemberList, setIsInMemberList] = useState(false);

    const roomsStore = useRoomsStore();
    const { joinedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string };

    useLayoutEffect(() => {
        if (isInMemberList)
            setIsInMemberList(false);
    }, [joinedRoomId])

    const joinedRoom = useRoom(joinedRoomId);

    // Detect if we're below md breakpoint (768px)
    const isMobile = useMediaQuery('(max-width: 767px)');

    if (!joinedRoom) {
        return (
            <div className='flex-1 bg-background p-6 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-xl font-semibold mb-1'>Join a room to get started!</div>
                    <div className='text-sm text-muted-foreground'>Select a room {isMobile ? 'from above' : 'on the left'} or create a new one.</div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-1 flex flex-col bg-card rounded-xl overflow-auto'>
            {isInMemberList ? (
                <>
                    <div className='flex flex-row w-full items-center p-4 gap-2'>
                        <ChatButton onClick={() => setIsInMemberList(false)}>
                            <ArrowLeft className='size-5' />
                        </ChatButton>

                        <p className='text-xl'>Members in {joinedRoom.name}</p>
                    </div>
                    <Separator />
                    <RoomMemberList />
                </>
            ) : (
                <>
                    <ChatHeader onToggleMemberList={setIsInMemberList} />
                    <Separator />
                    <MessageList />
                    <Separator />
                    <ChatComposer roomId={joinedRoom._id} />
                </>
            )}
        </div>
    )
}
