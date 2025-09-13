import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { socket } from '@/socket';
import type { IRoom } from '@/types/room.types';
import type { IPublicUser, IUser } from '@/types/user.types'
import { useState, type FC } from 'react'

interface KickDialogProps {
    /** The admin of the room */
    admin: IUser

    /** The user to be kicked */
    user: IPublicUser;

    /** The room object */
    room: IRoom
}

export const KickDialog: FC<KickDialogProps> = ({ admin, user, room }) => {
    const [reason, setReason] = useState('');

    const handleKick = () => {
        socket.emit('kickFromRoom', room._id, user._id, admin._id, reason, ({ success }) => {
            if (success) {
                console.log('Kicked member successfully');
            } else {
                console.error('An error occured while kicking member');
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>Kick</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className='flex flex-col gap-4'>
                            <p>You are about to kick {user.username} from the room.</p>
                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='kick-reason' className='flex gap-1'>
                                    <span>Reason</span>
                                    <span className='text-xs'>(Optional)</span>
                                </Label>
                                <Input
                                    id='kick-reason'
                                    className='text-primary'
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button className='text-primary' variant='outline'>Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleKick} autoFocus>Kick</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
