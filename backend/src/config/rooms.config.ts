import { IRoom } from "@src/types";

export const MAX_SYSTEM_ROOMS = 3;

export const DEFAULT_SYSTEM_ROOM_CONFIG: Omit<IRoom, '_id' | 'owner' | 'createdAt' | 'updatedAt'> = {
    code: '',
    isSystemGenerated: true,
    memberLimit: 10,
    members: [],
    messages: [],
    name: 'Public Chat Room',
    visibility: 'public'
}

export const DEFAULT_ROOM_CODE_LENGTH = 6;