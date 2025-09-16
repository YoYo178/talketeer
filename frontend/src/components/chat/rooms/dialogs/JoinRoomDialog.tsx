import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRoomsStore } from '@/hooks/state/useRoomsStore'
import { socket } from '@/socket'
import { stopListeningRoomEvents, startListeningRoomEvents } from '@/sockets/room.sockets'
import { useQueryClient } from '@tanstack/react-query'
import { HousePlus } from 'lucide-react'
import { useState } from 'react'

export const JoinRoomDialog = () => {
    const queryClient = useQueryClient();

    const { joinedRoomId, setJoinedRoomId, setSelectedRoomId } = useRoomsStore();

    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!!joinedRoomId) {
            socket.emit('leaveRoom', joinedRoomId, ({ success, error }) => {
                if (success) {
                    stopListeningRoomEvents(socket);

                    queryClient.invalidateQueries({ queryKey: ['rooms', joinedRoomId] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

                    socket.emit('joinRoom', { method: 'code', data: code }, ({ success, data, error }) => {
                        if (success && !!data) {
                            startListeningRoomEvents(socket, queryClient);
                            setJoinedRoomId(data.roomId);
                            setSelectedRoomId(null);
                            queryClient.invalidateQueries({ queryKey: ['rooms', data.roomId] });
                            queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                            setOpen(false);
                        } else {
                            setError(error ?? 'Unknown error')
                        }
                    });
                } else {
                    setError(error ?? 'Unknown error')
                }
            });
        } else {
            socket.emit('joinRoom', { method: 'code', data: code }, ({ success, data, error }) => {
                if (success && !!data) {
                    startListeningRoomEvents(socket, queryClient);
                    setJoinedRoomId(data.roomId);
                    setSelectedRoomId(null);
                    queryClient.invalidateQueries({ queryKey: ['rooms', data!] });
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
                    setOpen(false);
                } else {
                    setError(error ?? 'Unknown error')
                }
            });
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error.length)
            setError('');

        setCode(e.target.value)
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
                    <div className='flex flex-col gap-1'>
                        <Input
                            id='room-code-1'
                            type='text'
                            maxLength={6}
                            value={code}
                            onChange={handleInput}
                            placeholder='Room code'
                            className={error ? "border-red-500" : ""}
                            required
                        />
                        {error && (
                            <p className='text-sm text-red-500'>{error}</p>
                        )}
                    </div>

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
