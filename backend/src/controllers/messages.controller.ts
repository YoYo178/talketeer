import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { DMRoom, Message } from '@src/models';
import { TMessagesQuery, TMessageIdParams, TDmMessagesQuery, TDmMessageQuery } from '@src/schemas';
import { APIError } from '@src/utils';
import type { Request, Response } from 'express';

const MESSAGES_PER_PAGE = 20;

export const getMessages = async (req: Request, res: Response) => {
  const { roomId, before, after } = req.query as unknown as TMessagesQuery;

  const query: { _id?: { $lt: string } | { $gt: string }, room: string } = { room: roomId };

  if (before)
    query._id = { $lt: before };

  if (after)
    query._id = { $gt: after };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 }) // Fetch in Descending order (newest to oldest)
    .lean()
    .exec();

  const moreMessagesExist = messages.length > MESSAGES_PER_PAGE;
  const sliced = moreMessagesExist ? messages.slice(0, MESSAGES_PER_PAGE) : messages;

  // Sort this specific batch in ascending order (oldest to newest) before returning
  sliced.reverse();

  res.status(200).json({
    success: true, data: {
      messages: sliced,
      nextCursor: moreMessagesExist ? sliced[0]._id : null,
    },
  });
};

export const getMessageById = async (req: Request, res: Response) => {
  const { messageId } = req.params as TMessageIdParams;

  const message = await Message.findById(messageId);

  if (!message)
    throw new APIError('Message not found', HttpStatusCodes.NOT_FOUND);

  res.status(HttpStatusCodes.OK).json({ success: true, data: { message } });
};

export const getDmMessages = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { roomId, before, after } = req.query as unknown as TDmMessagesQuery;

  const room = await DMRoom.findOne({ _id: roomId, members: userId });

  if (!room || !room.isActive) {
    res.status(200).json({
      success: true, data: {
        messages: [],
        nextCursor: null,
      },
    });

    return;
  }

  const query: { _id?: { $lt: string } | { $gt: string }, room: string } = { room: roomId };

  if (before)
    query._id = { $lt: before };

  if (after)
    query._id = { $gt: after };

  const messages = await Message.find(query)
    .sort({ createdAt: -1 }) // Fetch in Descending order (newest to oldest)
    .lean()
    .exec();

  const moreMessagesExist = messages.length > MESSAGES_PER_PAGE;
  const sliced = moreMessagesExist ? messages.slice(0, MESSAGES_PER_PAGE) : messages;

  // Sort this specific batch in ascending order (oldest to newest) before returning
  sliced.reverse();

  res.status(200).json({
    success: true, data: {
      messages: sliced,
      nextCursor: moreMessagesExist ? sliced[0]._id : null,
    },
  });
};

export const getDmMessageById = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { messageId, roomId } = req.params as TDmMessageQuery;

  const room = await DMRoom.findOne({ _id: roomId, members: userId });

  if (!room)
    throw new APIError('Room not found', HttpStatusCodes.NOT_FOUND);

  if (!room.isActive)
    throw new APIError('The person is not on your friend list.', HttpStatusCodes.BAD_REQUEST);

  const message = await Message.findById(messageId);

  if (!message)
    throw new APIError('Message not found', HttpStatusCodes.NOT_FOUND);

  res.status(HttpStatusCodes.OK).json({ success: true, data: { message } });
};