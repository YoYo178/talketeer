import mongoose from 'mongoose';

export type INotificationType =
  | 'friend-request'
  | 'friend-new'
  | 'friend-delete'
  | 'room-ban'
  | 'room-delete'
  | 'room-invite'
  | 'room-kick'
  | 'system'
  | 'unknown'
  | 'MESSAGE_READ';

export interface INotification {
  _id?: mongoose.Types.ObjectId;

  content?: string;

  type: INotificationType;

  messageId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | string;

  createdAt?: Date;
  updatedAt?: Date;
}
