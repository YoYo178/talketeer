import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useGetMeQuery } from '@/hooks/network/users/useGetMeQuery'
import type { IUser } from '@/types/user.types'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export const CreateRoomDialog = () => {
    const { data } = useGetMeQuery({ queryKey: ['users', 'me'] });
    const user: IUser | undefined = data?.data?.user;

    const [open, setOpen] = useState(false);

    const [name, setName] = useState(user ? `${user.username}'s room` : '');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [memberLimit, setMemberLimit] = useState([10]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(e)
        // TODO: create room
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
