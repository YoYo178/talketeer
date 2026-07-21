import { Router } from 'express';

import AuthRouter from './auth.routes.js';
import FilesRouter from './files.routes.js';
import GIFRouter from './gif.routes.js';
import MessagesRouter from './messages.routes.js';
import NotificationsRouter from './notifications.routes.js';
import RoomsRouter from './rooms.routes.js';
import UsersRouter from './users.routes.js';

import { requireAuth } from '@src/middlewares/auth.middleware.js';

const APIRouter = Router();

// Auth routes, do not require any authentication
APIRouter.use('/auth', AuthRouter);

// All other routes of the application, requiring valid authentication
APIRouter.use('/files', requireAuth, FilesRouter);
APIRouter.use('/gifs', requireAuth, GIFRouter);
APIRouter.use('/messages', requireAuth, MessagesRouter);
APIRouter.use('/notifications', requireAuth, NotificationsRouter);
APIRouter.use('/rooms', requireAuth, RoomsRouter);
APIRouter.use('/users', requireAuth, UsersRouter);

export default APIRouter;