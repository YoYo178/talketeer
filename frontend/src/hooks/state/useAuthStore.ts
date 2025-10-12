import { create } from 'zustand';

interface AuthState {
    email: string;
    setEmail: (email: string) => void;
}

export const useAuthStore = create<AuthState>(set => ({
    email: '',
    setEmail: (email) => set({ email })
}))