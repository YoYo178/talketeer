import { create } from 'zustand';

type DialogData =
    | { type: 'kick'; roomName: string; username: string; adminUsername: string; reason?: string }
    | { type: 'ban'; roomName: string; username: string; adminUsername: string; duration: number; reason?: string } // TODO: 'duration' type
    | { type: 'roomDeletion'; roomName: string; username: string }

interface DialogState {
    data: DialogData | null;
    setData: (data: DialogData | null) => void
}

export const useDialogStore = create<DialogState>(set => ({
    data: null,
    setData: (data) => set({ data })
}))