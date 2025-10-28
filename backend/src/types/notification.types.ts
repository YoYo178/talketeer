import mongoose from 'mongoose';

export type INotificationType = 'friend-request' | 'friend-new' | 'friend-delete' | 'room-ban' | 'room-delete' | 'room-invite' | 'room-kick' | 'system' | 'unknown';

export interface INotification {
    _id: mongoose.Types.ObjectId;

    content: string;
    type: INotificationType;

    createdAt?: Date;
    updatedAt?: Date;
}