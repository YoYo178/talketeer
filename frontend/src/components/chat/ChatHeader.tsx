import { Trash, Users, X } from 'lucide-react'
import { Button } from '../ui/button'
import { ChatButton } from './rich-text/utility/ChatButton'
import type { FC } from 'react';
import { useState } from 'react';
import { socket } from '@/socket';
import { stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '@/hooks/network/users/useGetMeQuery';
import { AlertDialog, AlertDialogFooter, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '../ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { EditRoomDialog } from './rooms/administration/EditRoomDialog';
import { useRoomsStore } from '@/hooks/state/useRoomsStore';
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery';

interface ChatHeaderProps {
    onToggleMemberList: (state: boolean) => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ onToggleMemberList }) => {
    const queryClient = useQueryClient();

    const [isLeaving, setIsLeaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const roomsStore = useRoomsStore();
    const { joinedRoomId, setJoinedRoomId } = roomsStore as typeof roomsStore & { joinedRoomId: string };

    const room = useRoom(joinedRoomId);

    const me = useMe();

    if (!room || !me)
        return;

    const isRoomOwner = room.owner === me._id;

    const handleRoomDelete = () => {
        if (!isRoomOwner || isDeleting)
            return;

        setIsDeleting(true);
        socket.emit('deleteRoom', room._id, ({ success }) => {
            if (success) {
                stopListeningRoomEvents(socket);
                setJoinedRoomId(null);
            }
            setIsDeleting(false);
        })
    }

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

    if (isRoomOwner)
        return (
            <div className='flex p-4'>
                <div className='flex gap-2 items-center flex-wrap'>
                    <p className='text-xl'>{room.name}</p>
                    <div className='flex '>
                        <EditRoomDialog room={room} />
                        {isRoomOwner && (
                            <AlertDialog>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                            <ChatButton>
                                                <Trash className='size-5' />
                                            </ChatButton>
                                        </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Delete room</p>
                                    </TooltipContent>
                                </Tooltip>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription asChild>
                                            <div>
                                                <p>You are about to permanently delete this room.</p>
                                                <p>All members will be kicked and the messages will be deleted.</p>
                                                <br />
                                                <p>This action cannot be undone.</p>
                                            </div>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel asChild>
                                            <Button className='text-primary' variant='outline'>Cancel</Button>
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button className='text-primary bg-red-600 hover:bg-red-500' onClick={handleRoomDelete}>Delete</Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
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
            </div>
        )

    return (
        <div className='flex p-4'>
            <p className='text-xl'>{room.name}</p>
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
        </div>
    )
}
