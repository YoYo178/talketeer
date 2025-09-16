import { create } from 'zustand';

interface GlobalState {
    membersOnline: number;
    setMembersOnline: (membersOnline: number) => void;
}

export const useGlobalStore = create<GlobalState>(set => ({
    membersOnline: 0,
    setMembersOnline: (membersOnline) => set({ membersOnline })
}))