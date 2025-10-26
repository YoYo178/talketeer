import { create } from 'zustand';

export interface TypingUser {
    roomType: 'normal' | 'dm';
    roomId: string;
    userId: string;

    // Above fields are enough to maintain uniqueness
    // Below is extra context for typing indicators
    username: string;
}

const areSameTypingUsers = (userA: Omit<TypingUser, 'username'>, userB: Omit<TypingUser, 'username'>) =>
    userA.roomId === userB.roomId &&
    userA.roomType === userB.roomType &&
    userA.userId === userB.userId

interface RoomsState {
    selectedRoomId: string | null;
    joinedRoomId: string | null;

    setSelectedRoomId: (selectedRoomId: string | null) => void;
    setJoinedRoomId: (joinedRoomId: string | null) => void;

    dmRoomId: string | null;
    setDmRoomId: (dmRoomId: string | null) => void;

    typingUsers: TypingUser[];
    addTypingUser: (typingUser: TypingUser) => void;
    removeTypingUser: (typingUser: Omit<TypingUser, 'username'>) => void;
    setTypingUsers: (typingUsers: TypingUser[]) => void;
}

export const useRoomsStore = create<RoomsState>(set => ({
    selectedRoomId: null,
    joinedRoomId: null,

    setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
    setJoinedRoomId: (joinedRoomId) => set({ joinedRoomId }),

    dmRoomId: null,
    setDmRoomId: (dmRoomId) => set({ dmRoomId }),

    typingUsers: [],
    addTypingUser: (typingUser) => set((state) => {
        const exists = state.typingUsers.some((user) => areSameTypingUsers(user, typingUser));
        return exists ? state : { typingUsers: [...state.typingUsers, typingUser] }
    }),
    removeTypingUser: (typingUser) => set((state) => ({ typingUsers: state.typingUsers.filter(user => !areSameTypingUsers(user, typingUser)) })),
    setTypingUsers: (typingUsers) => set({ typingUsers })
}))