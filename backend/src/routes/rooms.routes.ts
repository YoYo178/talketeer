import { Router } from 'express';

import { validate } from '@src/middlewares';
import { friendIdParamsSchema, roomIdParamsSchema } from '@src/schemas';

import { getAllRooms, getRoomById, getAllDmRooms, getDmRoomById, getDmRoomByFriendId } from '@src/controllers';

const RoomsRouter = Router();

// This will only return the DM rooms the user is part of, unlike the above routes
RoomsRouter.get('/dm', getAllDmRooms);
RoomsRouter.get('/dm/friend/:friendId', validate({ params: friendIdParamsSchema }), getDmRoomByFriendId);
RoomsRouter.get('/dm/:roomId', validate({ params: roomIdParamsSchema }), getDmRoomById);

RoomsRouter.get('/', getAllRooms);
RoomsRouter.get('/:roomId', validate({ params: roomIdParamsSchema }), getRoomById);

export default RoomsRouter;