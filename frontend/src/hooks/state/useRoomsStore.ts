import { create } from 'zustand';

interface RoomsState {
    selectedRoomId: string | null;
    joinedRoomId: string | null;

    setSelectedRoomId: (selectedRoomId: string | null) => void;
    setJoinedRoomId: (joinedRoomId: string | null) => void;

    dmRoomId: string | null;
    setDmRoomId: (dmRoomId: string | null) => void;
}

export const useRoomsStore = create<RoomsState>(set => ({
    selectedRoomId: null,
    joinedRoomId: null,

    setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
    setJoinedRoomId: (joinedRoomId) => set({ joinedRoomId }),

    dmRoomId: null,
    setDmRoomId: (dmRoomId) => set({ dmRoomId }),
}))