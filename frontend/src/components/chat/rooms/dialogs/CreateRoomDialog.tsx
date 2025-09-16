import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useMe } from '@/hooks/network/users/useGetMeQuery'
import { useRoomsStore } from '@/hooks/state/useRoomsStore'
import { socket } from '@/socket'
import { startListeningRoomEvents, stopListeningRoomEvents } from '@/sockets/room.sockets'
import type { APIResponse } from '@/types/api.types'
import type { IRoom } from '@/types/room.types'
import { useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export const CreateRoomDialog = () => {
    const { setJoinedRoomId, setSelectedRoomId } = useRoomsStore();
    const queryClient = useQueryClient();
    const me = useMe();

    const [open, setOpen] = useState(false);

    const [name, setName] = useState(me ? `${me.username}'s room` : '');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [memberLimit, setMemberLimit] = useState([10]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        socket.emit('createRoom', name, visibility, memberLimit[0], ({ success, data }) => {
            if (success) {

                // If we were in a room, the backend will leave it first
                if (me?.room)
                    // Invalidate the old room's queries so we can get the latest data
                    queryClient.invalidateQueries({ queryKey: ['rooms', me.room] });

                if (data) {
                    const oldRoomsData: APIResponse<{ rooms: IRoom[] }> | undefined = queryClient.getQueryData(['rooms']);
                    const newRoomsData: APIResponse<{ rooms: IRoom[] }> = {
                        success: true,
                        data: { rooms: [...(oldRoomsData?.data?.rooms || []), data] }
                    }

                    // Add created room to cache
                    queryClient.setQueryData(['rooms'], newRoomsData);

                    // Refetch our own user object to get the latest 'room' property state
                    queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

                    setJoinedRoomId(data._id);
                    setSelectedRoomId(null);
                }

                setOpen(false);
                stopListeningRoomEvents(socket);
                startListeningRoomEvents(socket, queryClient);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>

                <Button className='flex-1 whitespace-nowrap'>
                    <Plus className='size-5' /> New room
                </Button>

            </DialogTrigger>

            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Create a new room</DialogTitle>
                    <DialogDescription>Pick a name and adjust settings accordingly for your room.</DialogDescription>
                </DialogHeader>

                <Separator />

                <form onSubmit={handleSubmit} className='grid gap-3' >
                    <Label htmlFor='room-name-1'>Room name</Label>
                    <Input
                        id='room-name-1'
                        name='room-name'
                        placeholder='My awesome room'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <Label htmlFor='visibility-1'>Room visibility</Label>
                    <ToggleGroup
                        id='visibility-1'
                        type="single"
                        value={visibility}
                        onValueChange={(val: 'public' | 'private') => val && setVisibility(val)}
                        className="w-full"
                    >
                        <ToggleGroupItem
                            value="public"
                            className="flex-1 cursor-pointer"
                        >
                            Public
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="private"
                            className="flex-1 cursor-pointer"
                        >
                            Private
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <div className='flex justify-between'>
                        <Label htmlFor='member-limit-1'>Member limit</Label>
                        <p className='text-sm text-muted-foreground'>{memberLimit[0]}</p>
                    </div>
                    <Slider
                        id='member-limit-1'
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={setMemberLimit}
                        defaultValue={memberLimit}
                        className='mb-4'
                    />

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type='button' variant='outline'>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type='submit'>Create</Button>
                    </DialogFooter>

                </form>

            </DialogContent>

        </Dialog>
    )
}
