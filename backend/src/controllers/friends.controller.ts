import HttpStatusCodes from "@src/common/HttpStatusCodes";
import type { Request, Response, NextFunction } from "express";

export const sendFriendRequest = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'sendFriendRequest: TODO!' })
}

export const acceptFriendRequest = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'acceptFriendRequest: TODO!' })
}