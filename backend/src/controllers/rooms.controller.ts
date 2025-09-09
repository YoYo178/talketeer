import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { Room } from "@src/models";
import { TRoomIdParams } from "@src/schemas";
import { IRoomPublicView, IRoom } from "@src/types";
import { sanitizeRoomObj } from "@src/utils/room.utils";
import type { Request, Response, NextFunction } from "express";

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    const dbRooms = await Room.find({})
        .populate({
            path: 'messages',
            options: { sort: { createdAt: 1 } },
            perDocumentLimit: 20
        })
        .lean()
        .exec();

    const rooms: (IRoom | IRoomPublicView)[] = dbRooms.map(room => sanitizeRoomObj(room, req.user.id))

    res.status(HttpStatusCodes.OK).json({ success: true, data: { rooms } })
}

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params as TRoomIdParams;

    const room = await Room.findById(roomId)
        .populate({
            path: 'messages',
            options: { sort: { createdAt: 1 } },
            perDocumentLimit: 20
        })
        .lean()
        .exec();

    if (!room) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: 'Room not found' })
        return;
    }

    res.status(HttpStatusCodes.OK).json({ success: true, data: { room: sanitizeRoomObj(room, req.user.id) } })
}