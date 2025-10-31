import { Router } from 'express';

import { validate } from '@src/middlewares';
import { updateMeBodySchema, userIdParamsSchema } from '@src/schemas';

import { getMe, getUser, updateMe } from '@src/controllers';

const UsersRouter = Router();

UsersRouter.get('/me', getMe);
UsersRouter.patch('/me', validate({ body: updateMeBodySchema }), updateMe);

UsersRouter.get('/:userId', validate({ params: userIdParamsSchema }), getUser);

export default UsersRouter;