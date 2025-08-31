import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { Room } from "@src/models";
import { TRoomIdParams } from "@src/schemas";
import type { Request, Response, NextFunction } from "express";

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    const rooms = await Room.find({})
        .populate({
            path: 'messages',
            options: { sort: { createdAt: -1 } },
            perDocumentLimit: 20
        });

    rooms.forEach(room => {
        room.messages = room.messages.reverse();
    })

    res.status(HttpStatusCodes.OK).json({ success: true, data: { rooms } })
}

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params as TRoomIdParams;

    const room = await Room.findById(roomId)
        .populate({
            path: 'messages',
            options: { sort: { createdAt: -1 } },
            perDocumentLimit: 20
        });

    if (!room) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: 'Room not found' })
        return;
    }

    room.messages = room.messages.reverse();

    res.status(HttpStatusCodes.OK).json({ success: true, data: { room: room.toObject() } })
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