import { create } from 'zustand';

type DialogData =
    | { type: 'kick'; roomName: string; username: string; adminUsername: string; reason?: string }
    | { type: 'ban'; created: number; expiry: number | null; isPermanent: boolean } // Banned from joining room
    | { type: 'liveBan'; roomName: string; adminUsername: string; created: number; expiry: number | null; isPermanent: boolean; reason?: string } // Banned while in the room, hence 'live'
    | { type: 'roomDeletion'; roomName: string; username: string }

interface DialogState {
    data: DialogData | null;
    setData: (data: DialogData | null) => void
}

export const useDialogStore = create<DialogState>(set => ({
    data: null,
    setData: (data) => set({ data })
}))