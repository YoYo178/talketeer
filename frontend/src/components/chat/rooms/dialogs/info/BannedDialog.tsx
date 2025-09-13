import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDialogStore } from '@/hooks/state/useDialogStore';

export const BannedDialog = () => {
    const { data, setData } = useDialogStore();
    const castedData = data as typeof data & { type: 'ban' };

    return (
        <Dialog open={data?.type === 'ban'} onOpenChange={() => setData(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Banned from room</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <p>You have been banned from room "{castedData?.roomName}" by the room owner.</p>
                            <p>Reason: "{castedData?.reason || 'No reason provided.'}"</p>
                        </div>
                    </DialogDescription>
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
