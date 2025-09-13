import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDialogStore } from '@/hooks/state/useDialogStore';

export const KickedDialog = () => {
    const { data, setData } = useDialogStore();
    const castedData = data as typeof data & { type: 'kick' };

    return (
        <Dialog open={data?.type === 'kick'} onOpenChange={() => setData(null)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kicked</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <p>You have been kicked from room "{castedData?.roomName}" by the room owner.</p>
                            <p>Reason: {castedData?.reason ? `"${castedData.reason}"` : 'No reason provided.'}</p>
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
