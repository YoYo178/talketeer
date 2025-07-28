import { Router } from "express";

import AuthRouter from "./auth.routes";
import FriendsRouter from "./friends.routes";
import RoomsRouter from "./rooms.routes";
import UsersRouter from "./users.routes";

const APIRouter = Router();

APIRouter.use('/auth', AuthRouter);
APIRouter.use('/friends', FriendsRouter);
APIRouter.use('/rooms', RoomsRouter);
APIRouter.use('/users', UsersRouter);

export default APIRouter;