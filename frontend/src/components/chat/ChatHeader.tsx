import { Copy, X } from 'lucide-react'
import { Button } from '../ui/button'
import { ChatButton } from './rich-text/utility/ChatButton'
import { useState } from 'react';
import { socket } from '@/socket';
import { stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { EditRoomDialog } from './rooms/administration/EditRoomDialog';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';
import { DeleteRoomDialog } from './rooms/administration/DeleteRoomDialog';
import { toast } from 'sonner';
import type { IRoom } from '@/types/room.types';
import { useGetUser } from '@/hooks/network/users/useGetUserQuery';
import { useDMRooms } from '@/hooks/network/rooms/useGetDmRoomsQuery';

export const ChatHeader = () => {
    const { dmRoomId, setDmRoomId } = useRoomsStore();
    const queryClient = useQueryClient();

    const [isLeaving, setIsLeaving] = useState(false);
    const [didCopyCode, setDidCopyCode] = useState(false);

    const roomsStore = useRoomsStore();
    const { joinedRoomId, setJoinedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string };

    const me = useMe();
    const room = useRoom<{ room: IRoom }>(joinedRoomId);

    const dmRoom = useDMRooms().find(room => room._id === dmRoomId);

    const friend = useGetUser(dmRoom?.members?.find(userId => userId !== me?._id) || '') ?? null;

    if ((!room && !dmRoom) || !me)
        return;

    const isRoomOwner = !dmRoomId ? room?.owner === me._id : false;

    const handleRoomLeave = () => {
        if (!!dmRoomId) {
            setDmRoomId(null);
            return;
        }

        if (!room || isLeaving)
            return;

        setIsLeaving(true);
        socket.emit('leaveRoom', room._id, ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: ['rooms', room._id] });
                stopListeningRoomEvents(socket);
                setJoinedRoomId(null);
            }
            setIsLeaving(false);
        });
    }

    const handleCopyRoomCode = async () => {
        if (didCopyCode || !room) return;

        try {
            await navigator.clipboard.writeText(room.code);
            toast('Copied room code!', { toasterId: 'room-code-copied-toast' });
            setDidCopyCode(true);
            setTimeout(() => setDidCopyCode(false), 2000);
        } catch (err) {
            console.error("Clipboard write failed:", err);
            toast('Failed to copy code. Please try again.', { toasterId: 'room-code-error-toast' });
        }
    };

    return (
        <div className='flex items-center p-4 justify-between'>
            <div className='flex gap-2 items-center'>
                <p className='text-sm md:text-base lg:text-lg font-semibold'>{dmRoomId ? `@${friend?.username}` : room!.name}</p>
                {!dmRoomId && (
                    <div className='flex'>
                        {/* Copy room code button */}
                        {(room!.visibility === 'public' || isRoomOwner) && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ChatButton onClick={handleCopyRoomCode}>
                                        <Copy className='size-4' />
                                    </ChatButton>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy room code</p>
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!dmRoomId && isRoomOwner && (
                            <>
                                <EditRoomDialog />
                                <DeleteRoomDialog />
                            </>
                        )}
                    </div>
                )}
            </div>

            <Button onClick={handleRoomLeave} >
                <X className='size-4' />
                <span className='text-xs sm:text-sm md:text-base font-bold'>{!!dmRoomId ? 'Close DM' : 'Leave room'}</span>
            </Button>
        </div>
    )
}
