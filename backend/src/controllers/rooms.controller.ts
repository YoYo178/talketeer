import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { Room } from "@src/models";
import { TRoomIdParams } from "@src/schemas";
import { IRoomPublicView, IRoom } from "@src/types";
import { APIError, sanitizeRoomObj } from "@src/utils";
import type { Request, Response, NextFunction } from "express";

export const getAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    const dbRooms = await Room.find({}).lean().exec();

    const rooms: (IRoom | IRoomPublicView)[] = dbRooms.map(room => sanitizeRoomObj(room, req.user.id))

    res.status(HttpStatusCodes.OK).json({ success: true, data: { rooms } })
}

export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params as TRoomIdParams;

    const room = await Room.findById(roomId).lean().exec();

    if (!room)
        throw new APIError('Room not found', HttpStatusCodes.NOT_FOUND);

    res.status(HttpStatusCodes.OK).json({ success: true, data: { room: sanitizeRoomObj(room, req.user.id) } })
}