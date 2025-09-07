import { Router } from "express";

import { validate } from "@src/middlewares";
import { roomIdParamsSchema } from "@src/schemas";

import { getAllRooms, getRoomById } from "@src/controllers";

const RoomsRouter = Router();

RoomsRouter.get('/', getAllRooms);
RoomsRouter.get('/:roomId', validate({ params: roomIdParamsSchema }), getRoomById);

export default RoomsRouter;