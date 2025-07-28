import { Router } from "express";

import { validate } from "@src/middlewares";
import { loginSchema, signupSchema } from "@src/schemas";

import { login, logout, signup } from '@src/controllers';

const AuthRouter = Router();

AuthRouter.post('/login', validate({ body: loginSchema }), login)
AuthRouter.post('/logout', logout)
AuthRouter.post('/signup', validate({ body: signupSchema }), signup)

export default AuthRouter;