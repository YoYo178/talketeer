import { Router } from "express";
import rateLimit, { Options } from 'express-rate-limit';

import { DEFAULT_RATE_LIMIT_OPTIONS } from "@src/config";
import { requireAuth, validate } from "@src/middlewares";

import { emailSchema, loginSchema, signupSchema, emailVerificationBodySchema, resendVerificationSchema, resetPasswordSchema } from "@src/schemas";

import { checkEmail, login, logout, signup, verifyEmail, resendVerification, requestPasswordReset, resetPassword } from '@src/controllers';

// Helper function to add rate limits
const limit = (options?: Partial<Options>) => rateLimit({ ...DEFAULT_RATE_LIMIT_OPTIONS, ...options })

const AuthRouter = Router();

// Login/Signup routes
AuthRouter.post('/login', limit({ limit: 5 }), validate({ body: loginSchema }), login)
AuthRouter.post('/check-email', limit({ limit: 10 }), validate({ body: emailSchema }), checkEmail)
AuthRouter.post('/logout', requireAuth, logout)
AuthRouter.post('/signup', limit({ limit: 15 }), validate({ body: signupSchema }), signup)

// Email verification
AuthRouter.post('/verify-email', validate({ body: emailVerificationBodySchema }), verifyEmail)
AuthRouter.post('/resend-verification', limit({ limit: 7 }), validate({ body: resendVerificationSchema }), resendVerification)

// Reset password (Account recovery)
AuthRouter.post('/request-reset', limit({ limit: 5 }), validate({ body: emailSchema }), requestPasswordReset)
AuthRouter.post('/reset-password', limit({ limit: 2 }),  validate({ body: resetPasswordSchema }), resetPassword)

export default AuthRouter;