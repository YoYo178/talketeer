import { create } from 'zustand';

interface GlobalState {
  usersOnline: number;
  setUsersOnline: (usersOnline: number) => void;

  hasNewNotifications: boolean;
  setHasNewNotifications: (hasNewNotifications: boolean) => void;

  isAvatarCardOpen: boolean;
  setIsAvatarCardOpen: (isAvatarCardOpen: boolean) => void;

  isProfileDialogOpen: boolean;
  setIsProfileDialogOpen: (isProfileDialogOpen: boolean) => void;

  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;

  isMemberListOpen: boolean;
  setIsMemberListOpen: (isMemberListOpen: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  usersOnline: 0,
  setUsersOnline: (usersOnline) => set({ usersOnline }),

  hasNewNotifications: false,
  setHasNewNotifications: (hasNewNotifications: boolean) => set({ hasNewNotifications }),

  isAvatarCardOpen: false,
  setIsAvatarCardOpen: (isAvatarCardOpen) => set({ isAvatarCardOpen }),

  isProfileDialogOpen: false,
  setIsProfileDialogOpen: (isProfileDialogOpen) => set({ isProfileDialogOpen }),

  isSidebarOpen: true,
  setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),

  isMemberListOpen: false,
  setIsMemberListOpen: (isMemberListOpen: boolean) => set({ isMemberListOpen }),
}));
