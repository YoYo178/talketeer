import { Trash, Users, X } from 'lucide-react'
import { Button } from '../ui/button'
import { ChatButton } from './rich-text/utility/ChatButton'
import type { IRoom } from '@/types/room.types'
import type { FC } from 'react';
import { useState } from 'react';
import { socket } from '@/socket';
import { stopListeningRoomEvents } from '@/sockets/room.sockets';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery';
import { AlertDialog, AlertDialogFooter, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from '../ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { EditRoomDialog } from './rooms/dialogs/EditRoomDialog';

interface ChatHeaderProps {
    selectedRoom: IRoom;
    onSelectRoomId: (roomId: string | null) => void;
    onToggleMemberList: (state: boolean) => void;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ selectedRoom, onSelectRoomId, onToggleMemberList }) => {
    const queryClient = useQueryClient();

    const [isLeaving, setIsLeaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: meData } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const me = meData?.data?.user;
    const isRoomOwner = selectedRoom.owner === me?._id;

    const handleRoomDelete = () => {
        if (!isRoomOwner || isDeleting)
            return;

        setIsDeleting(true);
        socket.emit('deleteRoom', selectedRoom._id, ({ success }) => {
            if (success) {
                stopListeningRoomEvents(socket);
                onSelectRoomId(null);
            }
            setIsDeleting(false);
        })
    }

    const handleRoomLeave = () => {
        if (!selectedRoom || isLeaving)
            return;

        setIsLeaving(true);
        socket.emit('leaveRoom', selectedRoom._id, ({ success }) => {
            if (success) {
                queryClient.invalidateQueries({ queryKey: ['rooms', selectedRoom._id] });
                stopListeningRoomEvents(socket);
                onSelectRoomId(null);
            }
            setIsLeaving(false);
        });
    }

    if (isRoomOwner)
        return (
            <div className='flex p-4'>
                <div className='flex gap-2 items-center'>
                    <p className='text-xl'>{selectedRoom.name}</p>
                    <div className='flex '>
                        <EditRoomDialog selectedRoom={selectedRoom} />
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
            <p className='text-xl'>{selectedRoom.name}</p>
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
