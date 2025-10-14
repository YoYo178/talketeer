import { mongooseObjectId } from '@src/utils';
import { z } from 'zod';

// Email verification schema
export const emailVerificationBodySchema = z.object({
    userId: mongooseObjectId,
    method: z.enum(['code', 'token']),
    data: z.string().nonempty().min(6)
})

export type TEmailVerificationBody = z.infer<typeof emailVerificationBodySchema>;

// Resend verification schema
export const resendVerificationSchema = z.object({
    userId: mongooseObjectId
})

export type TResendVerificationBody = z.infer<typeof resendVerificationSchema>;