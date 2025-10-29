import { IRoom } from '@src/types';

export const MAX_SYSTEM_ROOMS = 3;

export const DEFAULT_SYSTEM_ROOM_CONFIG: Omit<IRoom, '_id' | 'createdAt' | 'updatedAt'> = {
  code: '',
  isSystemGenerated: true,
  memberLimit: 10,
  memberCount: 0,
  members: [],
  name: 'Public Chat Room',
  visibility: 'public',
  owner: null,
};

export const DEFAULT_ROOM_CODE_LENGTH = 6;