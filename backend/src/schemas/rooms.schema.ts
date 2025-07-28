import { z } from 'zod';
import { mongooseObjectId } from '@src/utils/schema.utils';

// Room ID schema
export const roomIdParamsSchema = z.object({
    roomId: mongooseObjectId
})

export type TRoomIdParams = z.infer<typeof roomIdParamsSchema>

// Room ID + User ID schema
export const roomMemberParamsSchema = z.object({
    roomId: mongooseObjectId,
    userId: mongooseObjectId
})

export type TRoomMemberParams = z.infer<typeof roomMemberParamsSchema>

// Create room
export const createRoomSchema = z.object({
    name: z.string().max(50),
    usersLimit: z.number().gte(2).lte(10) // 2 <= n <= 10
})

export type TCreateRoomBody = z.infer<typeof createRoomSchema>