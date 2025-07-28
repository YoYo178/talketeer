import { Router } from "express";

import { getAllRooms, banUserFromRoom, createRoom, getRoomById, joinRoom, kickUserFromRoom, leaveRoom, deleteRoom } from "@src/controllers";

const RoomsRouter = Router();

RoomsRouter.get('/', getAllRooms);
RoomsRouter.get('/:roomId', getRoomById);

RoomsRouter.post('/', createRoom);
RoomsRouter.delete('/:roomId', deleteRoom);

RoomsRouter.post('/:roomId/members', joinRoom);
RoomsRouter.delete('/:roomId/members/me', leaveRoom);

RoomsRouter.delete('/:roomId/members/:userId', kickUserFromRoom);
RoomsRouter.patch('/:roomId/members/:userId', banUserFromRoom);

export default RoomsRouter;