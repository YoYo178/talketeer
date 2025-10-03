import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { socket } from '@/socket'
import type { IRoom } from '@/types/room.types'
import type { IPublicUser, IUser } from '@/types/user.types'
import { banDurations, getDurationValue } from '@/utils/date.utils'
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
    const [duration, setDuration] = useState(getDurationValue(60 * 24));

    const handleBan = () => {
        socket.emit('banFromRoom', room._id, user._id, admin._id, +duration, reason, ({ success }) => {
            if (success) {
                console.log('Banned member successfully');
            } else {
                console.error('An error occured while banning member');
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleBan();
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className='bg-red-600 hover:bg-red-500 dark:text-primary'>Ban</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
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
                                    <Input
                                        id='ban-reason'
                                        className='text-primary'
                                        value={reason}
                                        onChange={e => setReason(e.target.value)}
                                        autoComplete='off'
                                        autoFocus
                                    />

                                    <Label htmlFor='ban-duration'>Duration</Label>
                                    <Select value={duration} onValueChange={setDuration}>
                                        <SelectTrigger className="w-fit">
                                            <SelectValue id='ban-duration' placeholder="Select duration" />
                                        </SelectTrigger>
                                        <SelectContent side='right'>
                                            {banDurations.map(durationObj => <SelectItem value={getDurationValue(durationObj.minutes)}>{durationObj.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button className='text-primary' variant='outline'>Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button className='bg-red-600 hover:bg-red-500 dark:text-primary' type='submit'>Ban</Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}
