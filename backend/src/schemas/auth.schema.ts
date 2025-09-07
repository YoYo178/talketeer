import { z } from 'zod';

// Login
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().nonempty()
})

export type TLoginBody = z.infer<typeof loginSchema>

// CheckEmail
export const checkEmailSchema = z.object({
    email: z.email()
})

export type TCheckEmailBody = z.infer<typeof checkEmailSchema>

// Sign-up
export const signupSchema = z.object({
    username: z.string().nonempty(),
    name: z.string().nonempty(),
    displayName: z.string().nonempty(),

    email: z.email(),
    password: z.string().min(8)
})

export type TSignUpBody = z.infer<typeof signupSchema>