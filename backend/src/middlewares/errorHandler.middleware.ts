import HttpStatusCodes from "@src/common/HttpStatusCodes"
import type { Request, Response, NextFunction } from "express"

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: 'An error occured in the server. Please try again.' })
}