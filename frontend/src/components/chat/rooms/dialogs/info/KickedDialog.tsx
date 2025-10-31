import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { useState, useEffect } from 'react';

export const KickedDialog = () => {
    const { data, setData } = useDialogStore();
    const castedData = data as typeof data & { type: 'kick' };

    const [isOpen, setIsOpen] = useState(data?.type === 'kick');
    useEffect(() => setIsOpen(data?.type === 'kick'), [data?.type])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent onCloseAutoFocus={() => setData(null)}>
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
                        <Button onClick={() => setIsOpen(false)}>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
