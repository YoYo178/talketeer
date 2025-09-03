import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HousePlus } from 'lucide-react'
import { useState } from 'react'

export const JoinRoomDialog = () => {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: join room
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='flex-1 whitespace-nowrap'>
                    <HousePlus className='size-5' /> Join room
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join a room</DialogTitle>
                    <DialogDescription>
                        Enter the invite code to join an existing room.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className='grid gap-3' >

                    <Label htmlFor='room-code-1'>Room code</Label>
                    <Input
                        id='room-code-1'
                        type='text'
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder='Room code'
                        required
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type='button' variant='outline'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type='submit'>Join</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
