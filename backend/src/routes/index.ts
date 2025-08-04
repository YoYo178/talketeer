import { Router } from "express";

import AuthRouter from "./auth.routes";
import FriendsRouter from "./friends.routes";
import RoomsRouter from "./rooms.routes";
import UsersRouter from "./users.routes";
import { requireAuth } from "@src/middlewares";

const APIRouter = Router();

APIRouter.use('/auth', AuthRouter);
APIRouter.use('/friends', requireAuth, FriendsRouter);
APIRouter.use('/rooms', requireAuth, RoomsRouter);
APIRouter.use('/users', requireAuth, UsersRouter);

export default APIRouter;