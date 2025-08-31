import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { User } from "@src/models";
import { TUserIdParams } from "@src/schemas";
import { IPublicUser } from "@src/types";
import type { Request, Response, NextFunction } from "express";

export const getSelfUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    const { passwordHash, ...rest } = user!.toObject(); // Non-null assertion due to auth validation middleware

    res.status(HttpStatusCodes.OK).json({ success: true, data: { user: rest } })
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params as TUserIdParams;

    const user = await User.findById(userId);

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: 'User not found!', data: { user: null } });
        return;
    }

    const { name, email, passwordHash, friends, room, updatedAt, ...rest } = user.toObject();

    res.status(HttpStatusCodes.OK).json({ success: true, data: { user: rest as IPublicUser } })
}