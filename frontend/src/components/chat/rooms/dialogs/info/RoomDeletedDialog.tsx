import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { useState, useEffect } from 'react';

export const RoomDeletedDialog = () => {
    const { data, setData } = useDialogStore();

    const [isOpen, setIsOpen] = useState(data?.type === 'roomDeletion');
    useEffect(() => setIsOpen(data?.type === 'roomDeletion'), [data?.type])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent onCloseAutoFocus={() => setData(null)}>
                <DialogHeader>
                    <DialogTitle>Room deleted</DialogTitle>
                    <DialogDescription>The room you were in has been deleted by the room owner.</DialogDescription>
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
