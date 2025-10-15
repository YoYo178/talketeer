import { Router } from "express";
import rateLimit, { Options } from 'express-rate-limit';

import { DEFAULT_RATE_LIMIT_OPTIONS } from "@src/config";
import { requireAuth, validate } from "@src/middlewares";

import { emailSchema, loginSchema, signupSchema, emailVerificationBodySchema, resendVerificationSchema } from "@src/schemas";

import { checkEmail, login, logout, signup, verifyEmail, resendVerification } from '@src/controllers';

// Helper function to add rate limits
const limit = (options?: Partial<Options>) => rateLimit({ ...DEFAULT_RATE_LIMIT_OPTIONS, ...options })

const AuthRouter = Router();

AuthRouter.post('/login', limit({ limit: 5 }), validate({ body: loginSchema }), login)
AuthRouter.post('/check-email', limit({ limit: 10 }), validate({ body: emailSchema }), checkEmail)
AuthRouter.post('/logout', requireAuth, logout)
AuthRouter.post('/signup', limit({ limit: 15 }), validate({ body: signupSchema }), signup)

AuthRouter.post('/verify-email', validate({ body: emailVerificationBodySchema }), verifyEmail)
AuthRouter.post('/resend-verification', limit({ limit: 7 }), validate({ body: resendVerificationSchema }), resendVerification)

export default AuthRouter;