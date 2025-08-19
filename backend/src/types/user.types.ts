import { ObjectId } from "mongoose";

export interface IUserFriend {
    userId: ObjectId;
    status: 'confirmed' | 'pending';
    direction: 'incoming' | 'outgoing' | null;
}

export interface IUser {
    _id: ObjectId;

    /** User's full name */
    name: string;

    /** User's display name on the app */
    displayName: string;

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

    /** User's friends */
    friends: IUserFriend[];

    createdAt: number;
    updatedAt: number;
}