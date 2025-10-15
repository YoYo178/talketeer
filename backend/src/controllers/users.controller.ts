import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { User } from "@src/models";
import { TUpdateMeBody, TUserIdParams } from "@src/schemas";
import { APIError } from "@src/utils";
import type { Request, Response, NextFunction } from "express";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select('-passwordHash').lean().exec();

    if (!user)
        throw new APIError('User not found', HttpStatusCodes.NOT_FOUND);

    res.status(HttpStatusCodes.OK).json({ success: true, data: { user } })
}

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    const { bio, displayName, name } = req.body as TUpdateMeBody;

    const user = await User.findById(req.user.id).select('-passwordHash').exec();

    if (!user)
        throw new APIError('User not found', HttpStatusCodes.NOT_FOUND);

    user.name = name ?? user.name;
    user.displayName = displayName ?? user.displayName;
    user.bio = bio ?? user.bio;

    await user.save()

    req.io.emit('userUpdated', req.user.id);

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Updated user successfully', data: { user } })
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params as TUserIdParams;
    const user = await User.findById(userId)
        .select(`
            -passwordHash
            -name
            -email
            -friends
            -notifications
            -room
            -updatedAt
            -isVerified
            -verifiedAt
        `)
        .lean()
        .exec();

    if (!user)
        throw new APIError('User not found', HttpStatusCodes.NOT_FOUND);

    res.status(HttpStatusCodes.OK).json({ success: true, data: { user } });
}