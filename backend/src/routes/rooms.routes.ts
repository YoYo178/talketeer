import { Router } from "express";

import { validate } from "@src/middlewares";
import { createRoomSchema, roomIdParamsSchema, roomMemberParamsSchema } from "@src/schemas";

import { getAllRooms, banUserFromRoom, createRoom, getRoomById, joinRoom, kickUserFromRoom, leaveRoom, deleteRoom } from "@src/controllers";

const RoomsRouter = Router();

RoomsRouter.get('/', getAllRooms);
RoomsRouter.get('/:roomId', validate({ params: roomIdParamsSchema }), getRoomById);

RoomsRouter.post('/', validate({ body: createRoomSchema }), createRoom);
RoomsRouter.delete('/:roomId', validate({ params: roomIdParamsSchema }), deleteRoom);

RoomsRouter.post('/:roomId/members', validate({ params: roomIdParamsSchema }), joinRoom);
RoomsRouter.delete('/:roomId/members/me', validate({ params: roomIdParamsSchema }), leaveRoom);

RoomsRouter.delete('/:roomId/members/:userId', validate({ params: roomMemberParamsSchema }), kickUserFromRoom);
RoomsRouter.patch('/:roomId/members/:userId', validate({ params: roomMemberParamsSchema }), banUserFromRoom);

export default RoomsRouter;