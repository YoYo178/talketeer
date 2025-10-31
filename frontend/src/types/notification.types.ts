export type INotificationType = 'friend-request' | 'friend-new' | 'friend-delete' | 'room-ban' | 'room-delete' | 'room-invite' | 'room-kick' | 'system' | 'unknown';

export interface INotification {
    _id: string;

    content: string;
    type: INotificationType;

    createdAt: string;
    updatedAt: string;
}