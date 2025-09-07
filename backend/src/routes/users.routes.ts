import { Router } from "express";

import { validate } from "@src/middlewares";
import { userIdParamsSchema } from "@src/schemas";

import { getMe, getUser } from "@src/controllers";

const UsersRouter = Router();

UsersRouter.get('/me', getMe);
UsersRouter.get('/:userId', validate({ params: userIdParamsSchema }), getUser);

export default UsersRouter;