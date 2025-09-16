import { Copy, Users, X } from 'lucide-react'
import { Button } from '../ui/button'
import { ChatButton } from './rich-text/utility/ChatButton'
import type { FC } from 'react';
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
import { Toaster } from '../ui/sonner';
import { toast } from 'sonner';

interface ChatHeaderProps {
    onToggleMemberList: (state: boolean) => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ onToggleMemberList }) => {
    const queryClient = useQueryClient();

    const [isLeaving, setIsLeaving] = useState(false);
    const [didCopyCode, setDidCopyCode] = useState(false);

    const roomsStore = useRoomsStore();
    const { joinedRoomId, setJoinedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string };

    const me = useMe();
    const room = useRoom(joinedRoomId);

    if (!room || !me)
        return;

    const isRoomOwner = room.owner === me._id;

    const handleRoomLeave = () => {
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
        if (didCopyCode) return;

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

    if (isRoomOwner)
        return (
            <div className='flex p-4'>
                <div className='flex gap-2 items-center flex-wrap'>
                    <p className='text-xl'>{room.name}</p>
                    <div className='flex '>

                        {/* Copy room code button */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ChatButton onClick={handleCopyRoomCode}>
                                    <Copy />
                                </ChatButton>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copy room code</p>
                            </TooltipContent>
                        </Tooltip>

                        <EditRoomDialog />
                        <DeleteRoomDialog />
                    </div>
                </div>
                <div className='flex gap-2 ml-auto'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ChatButton onClick={() => onToggleMemberList(true)}>
                                <Users className='size-5' />
                            </ChatButton>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Member list</p>
                        </TooltipContent>
                    </Tooltip>
                    <Button onClick={handleRoomLeave}><X />Leave room</Button>
                </div>

                <Toaster id='room-code-copied-toast' />
            </div >
        )

    return (
        <div className='flex p-4'>
            <div className='flex gap-2 items-center flex-wrap'>
                <p className='text-xl'>{room.name}</p>
                <div className='flex'>
                    {/* Copy room code button */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <ChatButton onClick={handleCopyRoomCode}>
                                <Copy />
                            </ChatButton>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy room code</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className='flex gap-2 ml-auto'>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <ChatButton onClick={() => onToggleMemberList(true)}>
                            <Users className='size-5' />
                        </ChatButton>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Member list</p>
                    </TooltipContent>
                </Tooltip>
                <Button onClick={handleRoomLeave}><X />Leave room</Button>
            </div>

            <Toaster id='room-code-copied-toast' />
        </div>
    )
}
