import { z } from 'zod';
import { mongooseObjectId } from '@src/utils';

// Room ID schema
export const roomIdParamsSchema = z.object({
  roomId: mongooseObjectId,
});

export type TRoomIdParams = z.infer<typeof roomIdParamsSchema>;

// Friend ID schema
export const friendIdParamsSchema = z.object({
  friendId: mongooseObjectId,
});

export type TFriendIdParams = z.infer<typeof friendIdParamsSchema>;

// Room ID + User ID schema
export const roomMemberParamsSchema = z.object({
  roomId: mongooseObjectId,
  userId: mongooseObjectId,
});

export type TRoomMemberParams = z.infer<typeof roomMemberParamsSchema>;

// Create room
export const createRoomSchema = z.object({
  name: z.string().min(1).max(100),
  visibility: z.enum(['public', 'private']),
  memberLimit: z.number().min(2).max(10),
});

export type TCreateRoomBody = z.infer<typeof createRoomSchema>;

// Join room
export const joinRoomSchema = z.object({
  method: z.enum(['code', 'id']),
  data: z.string().min(1),
});

export type TJoinRoomBody = z.infer<typeof joinRoomSchema>;

// Leave room
export const leaveRoomSchema = z.object({
  roomId: z.string().min(1),
});

export type TLeaveRoomBody = z.infer<typeof leaveRoomSchema>;


export const banFromRoomSchema = z.object({
  roomId: mongooseObjectId,
  userId: mongooseObjectId,
  bannedBy: mongooseObjectId,
  duration: z.number(),
  reason: z.string().optional(),
});

export type TBanFromRoomPayload = z.infer<typeof banFromRoomSchema>;

export const kickFromRoomSchema = z.object({
  roomId: mongooseObjectId,
  userId: mongooseObjectId,
  kickedBy: mongooseObjectId,
  reason: z.string().optional(),
});

export type TKickFromRoomPayload = z.infer<typeof kickFromRoomSchema>;

export const updateRoomSchema = z.object({
  roomId: mongooseObjectId,
  name: z.string().min(1).max(100),
  visibility: z.enum(['public', 'private']),
  memberLimit: z.number().min(2).max(10),
});

export type TUpdateRoomPayload = z.infer<typeof updateRoomSchema>;