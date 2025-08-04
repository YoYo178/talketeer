import { z } from 'zod';
import { mongooseObjectId } from '@src/utils';

// User ID schema
export const userIdParamsSchema = z.object({
    userId: mongooseObjectId
})

export type TUserIdParams = z.infer<typeof userIdParamsSchema>