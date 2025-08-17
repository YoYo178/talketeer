import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { User } from "@src/models";
import type { Request, Response, NextFunction } from "express";

export const getSelfUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    const { passwordHash, ...rest } = user!.toObject(); // Non-null assertion due to auth validation middleware

    res.status(HttpStatusCodes.OK).json({ success: true, data: { user: rest } })
}

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'getUser: TODO!' })
}