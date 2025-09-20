import { User } from "@src/models";
import { Notification } from "@src/models/notification.model";
import { INotification, TalketeerSocketServer } from "@src/types";

export const pushNotification = (io: TalketeerSocketServer, userId: string, notification: INotification) => {
    io.to(userId).emit('notification', notification)
}

export async function saveNotification(userId: string, notificationObj: Omit<INotification, '_id' | 'createdAt' | 'updatedAt'>) {
    const notification = await Notification.create({ ...notificationObj });

    await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { notifications: notification._id } }
    )

    return notification.toObject();
}