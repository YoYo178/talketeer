import { z } from 'zod';
import { mongooseObjectId } from '@src/utils';

// User ID schema
export const userIdParamsSchema = z.object({
    userId: mongooseObjectId
})

export type TUserIdParams = z.infer<typeof userIdParamsSchema>

export const updateMeBodySchema = z.object({
    name: z.string().nonempty(),
    displayName: z.string(),
    
    bio: z.string(),
})

export type TUpdateMeBody = z.infer<typeof updateMeBodySchema>;