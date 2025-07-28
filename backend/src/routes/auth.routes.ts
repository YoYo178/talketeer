import { Router } from "express";

import { login, logout, signup } from '@src/controllers';

const AuthRouter = Router();

AuthRouter.post('/login', login)
AuthRouter.post('/logout', logout)
AuthRouter.post('/signup', signup)

export default AuthRouter;