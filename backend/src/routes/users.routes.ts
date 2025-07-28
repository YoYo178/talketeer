import { Router } from "express";

import { validate } from "@src/middlewares";
import { userIdParamsSchema } from "@src/schemas";

import { getSelfUser, getUser } from "@src/controllers";

const UsersRouter = Router();

UsersRouter.get('/me', getSelfUser);
UsersRouter.get('/:userId', validate({ params: userIdParamsSchema }), getUser);

export default UsersRouter;