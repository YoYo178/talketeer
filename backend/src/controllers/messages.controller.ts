import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { Message } from "@src/models";
import { TMessagesQuery, TMessageIdParams } from "@src/schemas"
import type { Request, Response, NextFunction } from "express"

const MESSAGES_PER_PAGE = 20;

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId, before, after } = req.query as unknown as TMessagesQuery;

    let query: any = { room: roomId };

    if (before)
        query._id = { $lt: before }

    if (after)
        query._id = { $gt: after }

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
        }
    });
}

export const getMessageById = async (req: Request, res: Response, next: NextFunction) => {
    const { messageId } = req.params as TMessageIdParams;

    const message = await Message.findById(messageId);
    if (!message) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: 'Message not found' });
        return;
    }

    res.status(HttpStatusCodes.OK).json({ success: true, data: { message } })
}