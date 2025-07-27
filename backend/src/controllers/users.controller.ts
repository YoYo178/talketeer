import HttpStatusCodes from "@src/common/HttpStatusCodes";
import type { Request, Response, NextFunction } from "express";

export const getSelfUser = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'getSelfUser: TODO!' })
}

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'getUser: TODO!' })
}