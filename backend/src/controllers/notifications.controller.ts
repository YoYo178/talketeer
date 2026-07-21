import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import { User } from '@src/models/user.model.js';
import type { TNotificationIdParams } from '@src/schemas/notifications.schema.js';
import { APIError } from '@src/utils/api.utils.js';
import type { Request, Response } from 'express';

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate('notifications')
    .lean()
    .exec();

  if (!user)
    throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  const notifications = user.notifications || [];

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { notifications } });
};

export const getNotification = async (req: Request, res: Response) => {
  const { notificationId } = req.params as TNotificationIdParams;
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate('notifications')
    .lean()
    .exec();

  if (!user)
    throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  const notification = (user.notifications || []).find(notificationObj => notificationObj._id.toString() === notificationId);

  if (!notification)
    throw new APIError('No associated notification object found for this ID', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { notification } });
};