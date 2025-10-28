import mongoose from 'mongoose';
import { DBRef } from './db.types';
import { IRoom } from './room.types';
import { INotification } from './notification.types';

export interface IUserFriend {
    userId: mongoose.Types.ObjectId;
    status: 'confirmed' | 'pending';
    direction: 'incoming' | 'outgoing' | null;
}

export interface IUser {
    _id: mongoose.Types.ObjectId;

    /** User's full name */
    name: string;

    /** User's display name on the app */
    displayName?: string;

    /** User's username (handle) */
    username: string;

    /** User's email */
    email: string;

    /** User's password hash */
    passwordHash: string;

    /** User's global role */
    role: 'admin' | 'user';

    /** User's bio */
    bio: string;

    /** User's avatar URL */
    avatarURL: string;

    /** User's notifications */
    notifications: DBRef<INotification>[];

    /** User's friends */
    friends: IUserFriend[];

    /** The room the user is currently in */
    room: mongoose.Types.ObjectId | null;

    /** Whether the user is verified */
    isVerified: boolean;

    /** The date when the user was verified */
    verifiedAt: Date;

    createdAt: number;
    updatedAt: number;
}

export type IPublicUser = Omit<
    IUser,
    'email' |
    'friends' |
    'name' |
    'notifications' |
    'passwordHash' |
    'room' |
    'updatedAt' |
    'isVerified' |
    'verifiedAt'
>;