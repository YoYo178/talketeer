import { User } from "@src/models";
import { Notification } from "@src/models";
import { INotification } from "@src/types";

export async function saveNotification(userId: string, notificationObj: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>) {
    const notification = await Notification.create({ ...notificationObj });

    await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { notifications: notification._id } }
    )

    return notification.toObject();
}