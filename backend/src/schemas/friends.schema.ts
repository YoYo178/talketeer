import { z } from 'zod';
import { mongooseObjectId } from '../utils';

// Send friend request
export const sendFriendRequestSchema = z.object({
    to: mongooseObjectId
})

export type TSendFriendRequestBody = z.infer<typeof sendFriendRequestSchema>

// Accept friend request
export const acceptFriendRequestParamSchema = z.object({
    userId: mongooseObjectId
})

export type TAcceptFriendRequestParams = z.infer<typeof acceptFriendRequestParamSchema>