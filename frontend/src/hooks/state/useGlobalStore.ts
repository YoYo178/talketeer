import { create } from 'zustand';

interface GlobalState {
    membersOnline: number;
    setMembersOnline: (membersOnline: number) => void;

    hasNewNotifications: boolean;
    setHasNewNotifications: (hasNewNotifications: boolean) => void;
}

export const useGlobalStore = create<GlobalState>(set => ({
    membersOnline: 0,
    setMembersOnline: (membersOnline) => set({ membersOnline }),

    hasNewNotifications: false,
    setHasNewNotifications: (hasNewNotifications: boolean) => set({ hasNewNotifications })
}))