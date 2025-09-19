import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { TAcceptFriendRequestParams, TSendFriendRequestBody } from "@src/schemas";
import { acceptUserFriendRequest, getUser, sendUserFriendRequest } from "@src/services/user.service";
import { APIError } from "@src/utils/api.utils";
import type { Request, Response, NextFunction } from "express";

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { to } = req.body as TSendFriendRequestBody;

    const senderId = req.user.id;
    const receiverId = to;

    if (receiverId === senderId)
        throw new APIError('You cannot send friend requests to yourself', HttpStatusCodes.BAD_REQUEST);

    const sender = await getUser(senderId);
    const receiver = await getUser(receiverId);

    if (!sender || !receiver)
        throw new APIError('Invalid user ID', HttpStatusCodes.BAD_REQUEST);

    const existingFriendObj = receiver.friends.find(friendObj => friendObj.userId.toString() === senderId);

    if (existingFriendObj?.status === 'confirmed')
        throw new APIError('The user is already in your friend list', HttpStatusCodes.CONFLICT)

    if (existingFriendObj)
        throw new APIError('Your friend request is already pending', HttpStatusCodes.CONFLICT);

    await sendUserFriendRequest(senderId, receiverId);

    req.io.to(receiverId).emit('notification');

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Sent friend request successfully' });
}

export const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { userId: senderId } = req.params as TAcceptFriendRequestParams;
    const receiverId = req.user.id;

    const receiver = (await getUser(receiverId))!;
    const existingFriendObj = receiver.friends.find(friendObj => friendObj.userId.toString() === senderId);

    if (!existingFriendObj)
        throw new APIError('No such friend request found', HttpStatusCodes.NOT_FOUND);

    // Make sure the sender doesn't accept it themselves somehow, lol
    if (existingFriendObj.direction === 'outgoing')
        throw new APIError('Only the other user can accept this friend request', HttpStatusCodes.BAD_REQUEST);

    // Since we're "accepting" the friend request, we're probably the receiver
    // thus inverted params
    await acceptUserFriendRequest(senderId, receiverId);

    req.io.to(senderId).emit('notification');

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Accepted friend request successfully' })
}