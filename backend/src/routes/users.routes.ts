import { Router } from "express";

import { getSelfUser, getUser } from "@src/controllers";

const UsersRouter = Router();

UsersRouter.get('/me', getSelfUser);
UsersRouter.get('/:userId', getUser);

export default UsersRouter;