import { create } from 'zustand';

const THEME_STORAGE_KEY = 'theme-preference'

function getInitialIsDark(): boolean {
    if (typeof window === 'undefined')
        return false;

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (!!stored)
        return stored === 'dark';

    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

interface SettingsState {
    isDark: boolean;
    setIsDark: (isDark: boolean) => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
    isDark: getInitialIsDark(),
    setIsDark: (isDark) => set({ isDark })
}))