import HttpStatusCodes from "@src/common/HttpStatusCodes";
import type { Request, Response, NextFunction } from "express";

export const getAllRooms = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'getAllRooms: TODO!' })
}

export const getRoomById = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'getRoomById: TODO!' })
}

export const createRoom = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'createRoom: TODO!' })
}

export const deleteRoom = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'deleteRoom: TODO!' })
}

export const joinRoom = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'joinRoom: TODO!' })
}

export const leaveRoom = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'leaveRoom: TODO!' })
}

export const kickUserFromRoom = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'kickUserFromRoom: TODO!' })
}

export const banUserFromRoom = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'banUserFromRoom: TODO!' })
}