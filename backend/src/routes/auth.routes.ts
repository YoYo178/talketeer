import { Router } from "express";
import rateLimit from 'express-rate-limit';

import { DEFAULT_RATE_LIMIT_OPTIONS } from "@src/config/api.config";
import { requireAuth, validate } from "@src/middlewares";
import { checkEmailSchema, loginSchema, signupSchema } from "@src/schemas";

import { checkEmail, login, logout, signup } from '@src/controllers';

const loginLimiter = rateLimit({
    ...DEFAULT_RATE_LIMIT_OPTIONS,
    limit: 5,
    message: { message: 'Too many login attempts from this IP, Please try again later' }
});

const AuthRouter = Router();

AuthRouter.post('/login', loginLimiter, validate({ body: loginSchema }), login)
AuthRouter.post('/check-email', validate({ body: checkEmailSchema }), checkEmail)
AuthRouter.post('/logout', requireAuth, logout)
AuthRouter.post('/signup', validate({ body: signupSchema }), signup)

export default AuthRouter;