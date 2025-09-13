import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { socket } from '@/socket'
import type { IRoom } from '@/types/room.types'
import type { IPublicUser, IUser } from '@/types/user.types'
import { useState, type FC } from 'react'

interface BanDialogProps {
    /** The admin of the room */
    admin: IUser

    /** The user to be banned */
    user: IPublicUser;

    /** The room object */
    room: IRoom
}

export const BanDialog: FC<BanDialogProps> = ({ admin, user, room }) => {
    const [reason, setReason] = useState('');

    const handleBan = () => {
        socket.emit('banFromRoom', room._id, user._id, admin._id, reason, ({ success }) => {
            if (success) {
                console.log('Banned member successfully');
            } else {
                console.error('An error occured while banning member');
            }
        })
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='bg-red-600 hover:bg-red-500 dark:text-primary'>Ban</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className='flex flex-col gap-4'>
                            <p>You are about to ban {user.username} from the room.</p>

                            <div className='flex flex-col gap-2'>
                                <Label htmlFor='ban-reason' className='flex gap-1'>
                                    <span>Reason</span>
                                    <span className='text-xs'>(Optional)</span>
                                </Label>
                                <Input id='ban-reason' value={reason} onChange={e => setReason(e.target.value)}></Input>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button className='text-primary' variant='outline'>Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button className='bg-red-600 hover:bg-red-500 dark:text-primary' onClick={handleBan} autoFocus>Ban</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
