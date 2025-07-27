import HttpStatusCodes from "@src/common/HttpStatusCodes";
import type { Request, Response, NextFunction } from "express";

export const login = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'login: TODO!' });
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'logout: TODO!' })
}

export const signup = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'signup: TODO!' })
}