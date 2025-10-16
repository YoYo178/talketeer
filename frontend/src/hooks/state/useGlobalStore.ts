import { create } from 'zustand';

interface GlobalState {
    usersOnline: number;
    setUsersOnline: (usersOnline: number) => void;

    hasNewNotifications: boolean;
    setHasNewNotifications: (hasNewNotifications: boolean) => void;

    isAvatarCardOpen: boolean;
    setIsAvatarCardOpen: (isAvatarCardOpen: boolean) => void;
}

export const useGlobalStore = create<GlobalState>(set => ({
    usersOnline: 0,
    setUsersOnline: (usersOnline) => set({ usersOnline }),

    hasNewNotifications: false,
    setHasNewNotifications: (hasNewNotifications: boolean) => set({ hasNewNotifications }),

    isAvatarCardOpen: false,
    setIsAvatarCardOpen: (isAvatarCardOpen) => set({ isAvatarCardOpen })
}))