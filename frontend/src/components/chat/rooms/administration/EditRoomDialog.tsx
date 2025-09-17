import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { socket } from '@/socket'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { ChatButton } from '../../rich-text/utility/ChatButton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useRoomsStore } from '@/hooks/state/useRoomsStore'
import { useRoom } from '@/hooks/network/rooms/useGetRoomByIdQuery'
import type { IRoom } from '@/types/room.types'

export const EditRoomDialog = () => {
    const queryClient = useQueryClient();

    const { joinedRoomId } = useRoomsStore();
    const room = useRoom<{ room: IRoom }>(joinedRoomId);

    const [open, setOpen] = useState(false);

    const [name, setName] = useState(room?.name || '');
    const [visibility, setVisibility] = useState<'public' | 'private'>(room?.visibility || 'public');
    const [memberLimit, setMemberLimit] = useState([room?.memberLimit || 10]);

    const handleSubmit = (e: React.FormEvent) => {
        if (!room)
            return;

        e.preventDefault();

        socket.emit('updateRoom', room._id, name, visibility, memberLimit[0], ({ success }) => {
            if (success) {
                // Refetch the room's latest data
                queryClient.invalidateQueries({ queryKey: ['rooms', room._id] });

                // Refetch our own user object to get the latest 'room' property state
                queryClient.invalidateQueries({ queryKey: ['users', 'me'] });

                setOpen(false);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <ChatButton>
                            <Pencil className='size-4.5' />
                        </ChatButton>
                    </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Edit room settings</p>
                </TooltipContent>
            </Tooltip>

            <DialogContent>

                <DialogHeader>
                    <DialogTitle>Edit room settings</DialogTitle>
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
                        <Button type='submit'>Save</Button>
                    </DialogFooter>

                </form>

            </DialogContent>

        </Dialog>
    )
}
