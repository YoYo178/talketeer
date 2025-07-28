import { z } from 'zod';

// Login
export const loginSchema = z.object({
    email: z.email(),
    password: z.string()
})

export type TLoginBody = z.infer<typeof loginSchema>

// Sign-up
export const signupSchema = z.object({
    username: z.string(),
    name: z.string(),
    displayName: z.string(),
    
    email: z.email(),
    password: z.string().min(8)
})

export type TSignUpBody = z.infer<typeof signupSchema>