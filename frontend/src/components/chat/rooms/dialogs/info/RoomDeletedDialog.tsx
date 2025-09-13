import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDialogStore } from '@/hooks/state/useDialogStore';

export const RoomDeletedDialog = () => {
    const { data, setData } = useDialogStore();

    return (
        <Dialog open={data?.type === 'roomDeletion'} onOpenChange={() => setData(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Room deleted</DialogTitle>
                    <DialogDescription>The room you were in has been deleted by the room owner.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => setData(null)}>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
