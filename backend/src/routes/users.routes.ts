import { Router } from 'express';

import { validate } from '@src/middlewares/validation.middleware.js';
import { updateMeBodySchema, userIdParamsSchema } from '@src/schemas/users.schema.js';

import { getMe, getUser, updateMe } from '@src/controllers/users.controller.js';

const UsersRouter = Router();

UsersRouter.get('/me', getMe);
UsersRouter.patch('/me', validate({ body: updateMeBodySchema }), updateMe);

UsersRouter.get('/:userId', validate({ params: userIdParamsSchema }), getUser);

export default UsersRouter;
