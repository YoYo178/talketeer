import { z } from 'zod';

// Email verification schema
export const emailVerificationBodySchema = z.object({
    email: z.email().nonempty(),
    method: z.enum(['code', 'token']),
    data: z.string().nonempty().min(6)
})

export type TEmailVerificationBody = z.infer<typeof emailVerificationBodySchema>;