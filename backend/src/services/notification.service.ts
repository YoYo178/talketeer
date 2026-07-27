import { User } from '@src/models/user.model.js';
import { Notification } from '@src/models/notification.model.js';
import type { INotification } from '@src/types/notification.types.js';

export async function saveNotification(
  userId: string,
  notificationObj: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>,
) {
  const notification = await Notification.create({ ...notificationObj });

  await User.findOneAndUpdate({ _id: userId }, { $addToSet: { notifications: notification._id } });

  return notification.toObject();
}
