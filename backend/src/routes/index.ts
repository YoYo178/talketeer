import { Router } from "express";

import AuthRouter from "./auth.routes";
import FilesRouter from "./files.router";
import GIFRouter from "./gif.router";
import MessagesRouter from "./messages.routes";
import NotificationsRouter from "./notifications.routes";
import RoomsRouter from "./rooms.routes";
import UsersRouter from "./users.routes";

import { requireAuth } from "@src/middlewares";

const APIRouter = Router();

// Auth routes, do not require any authentication
APIRouter.use('/auth', AuthRouter);

// All other routes of the application, requiring valid authentication
APIRouter.use('/files', requireAuth, FilesRouter)
APIRouter.use('/gifs', requireAuth, GIFRouter);
APIRouter.use('/messages', requireAuth, MessagesRouter);
APIRouter.use('/notifications', requireAuth, NotificationsRouter);
APIRouter.use('/rooms', requireAuth, RoomsRouter);
APIRouter.use('/users', requireAuth, UsersRouter);

export default APIRouter;