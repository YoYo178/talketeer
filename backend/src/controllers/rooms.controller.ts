import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { Room } from "@src/models";
import type { Request, Response, NextFunction } from "express";

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    const rooms = await Room.find({});
    res.status(HttpStatusCodes.OK).json({ success: true, data: { rooms } })
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