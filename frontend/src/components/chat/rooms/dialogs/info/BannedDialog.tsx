import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDialogStore } from '@/hooks/state/useDialogStore';
import { useEffect, useState } from 'react';

// a very simple helper function to wrap the provided string in parenthesis
// or return a space (because why not)
const par = (str: string | undefined) => str ? ` (${str}) ` : ' '

export const BannedDialog = () => {
    const { data, setData } = useDialogStore();
    const castedData = data as typeof data & { type: 'ban' | 'liveBan' };

    const shouldDisplay = ['ban', 'liveBan'].includes(castedData?.type);

    const [isOpen, setIsOpen] = useState(shouldDisplay);
    useEffect(() => setIsOpen(shouldDisplay), [castedData?.type])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent onCloseAutoFocus={() => setData(null)}>
                <DialogHeader>
                    <DialogTitle>Banned</DialogTitle>
                    <DialogDescription asChild>
                        {castedData?.type === 'liveBan' ? (
                            <div>
                                <p>You have been{castedData?.isPermanent ? ' permanently' : ''} banned from the room{par(castedData?.roomName)}by the room owner{par(castedData?.adminUsername)}</p>
                                <p>Reason: {castedData?.reason || 'No reason provided'}</p>
                            </div>
                        ) : (
                            <div>
                                {castedData && castedData?.isPermanent ? (
                                    <p>You have been permanently banned from joining this room.</p>
                                ) : (
                                    <>
                                        <p>You have been banned from joining this room</p>
                                        <p>Please try again after your ban expires.</p>
                                        <br />
                                        <p>Expires at: {new Date(castedData?.expiry || 0).toLocaleString()}</p>
                                    </>
                                )}
                            </div>
                        )}
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
