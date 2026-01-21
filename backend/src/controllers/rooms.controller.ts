import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';
import { DMRoom, Room } from '@src/models';
import { TFriendIdParams, TRoomIdParams } from '@src/schemas';
import { IRoomPublicView, IRoom } from '@src/types';
import { APIError, sanitizeRoomObj } from '@src/utils';
import type { Request, Response } from 'express';

export const getAllRooms = async (req: Request, res: Response) => {
  const dbRooms = await Room.find({}).lean().exec();

  const rooms: (IRoom | IRoomPublicView)[] = dbRooms.map(room => sanitizeRoomObj(room, req.user!.id));

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { rooms } });
};

export const getRoomById = async (req: Request, res: Response) => {
  const { roomId } = req.params as TRoomIdParams;

  const room = await Room.findById(roomId).lean().exec();

  if (!room)
    throw new APIError('Room not found', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { room: sanitizeRoomObj(room, req.user!.id) } });
};

export const getAllDmRooms = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const rooms = await DMRoom.find({ members: userId }).lean().exec();
  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { rooms } });
};

export const getDmRoomById = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { roomId } = req.params as TRoomIdParams;

  const room = await DMRoom.findOne({ _id: roomId, members: userId }).lean().exec();

  if (!room)
    throw new APIError('DM Room not found', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { room } });
};

export const getDmRoomByFriendId = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { friendId } = req.params as TFriendIdParams;

  const room = await DMRoom.findOne({ members: { $all: [userId, friendId] } }).lean().exec();

  if (!room)
    throw new APIError('DM Room not found', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { room } });
};