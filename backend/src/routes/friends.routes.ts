import { Router } from "express";

import { validate } from "@src/middlewares";
import { acceptFriendRequestParamSchema, sendFriendRequestSchema } from "@src/schemas";

import { acceptFriendRequest, sendFriendRequest } from '@src/controllers'

const FriendsRouter = Router();

FriendsRouter.post('/', validate({ body: sendFriendRequestSchema }), sendFriendRequest);
FriendsRouter.patch('/:userId', validate({ params: acceptFriendRequestParamSchema }), acceptFriendRequest);

export default FriendsRouter;