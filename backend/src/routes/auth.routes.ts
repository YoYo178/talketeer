import { Router } from "express";

import { requireAuth, validate } from "@src/middlewares";
import { checkEmailSchema, loginSchema, signupSchema } from "@src/schemas";

import { checkEmail, login, logout, signup } from '@src/controllers';

const AuthRouter = Router();

AuthRouter.post('/login', validate({ body: loginSchema }), login)
AuthRouter.post('/check-email', validate({ body: checkEmailSchema }), checkEmail)
AuthRouter.post('/logout', requireAuth, logout)
AuthRouter.post('/signup', validate({ body: signupSchema }), signup)

export default AuthRouter;