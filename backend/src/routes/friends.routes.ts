import { Router } from "express";

import { acceptFriendRequest, sendFriendRequest } from '@src/controllers'

const FriendsRouter = Router();

FriendsRouter.post('/', sendFriendRequest);
FriendsRouter.patch('/:userId', acceptFriendRequest);

export default FriendsRouter;