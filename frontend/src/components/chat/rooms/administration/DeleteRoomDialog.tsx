import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Trash } from 'lucide-react'
import { ChatButton } from '../../rich-text/utility/ChatButton'
import { socket } from '@/socket'
import { stopListeningRoomEvents } from '@/sockets/room.sockets'
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery'
import { useMe } from '@/hooks/network/users/useGetMeQuery'
import { useRoomsStore } from '@/hooks/state/useRoomsStore'
import { useState } from 'react'
import type { IRoom } from '@/types/room.types'

export const DeleteRoomDialog = () => {
    const [isDeleting, setIsDeleting] = useState(false);
    const { joinedRoomId, setJoinedRoomId } = useRoomsStore();

    const room = useRoom<{ room: IRoom }>(joinedRoomId);
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

    return (
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
    )
}
