export interface IUserFriend {
    /** User's ID */
    userId: string;
    status: 'confirmed' | 'pending';
    direction: 'incoming' | 'outgoing' | null;
}

export interface IUser {
    /** User's ID */
    _id: string;

    /** User's full name */
    name: string;

    /** User's display name on the app */
    displayName: string;

    /** User's username (handle) */
    username: string;

    /** User's email */
    email: string;

    /** User's password hash */
    // We don't need this at the frontend :)
    // passwordHash: string;

    /** User's bio */
    bio: string;

    /** User's avatar URL */
    avatarURL: string;

    /** User's friends */
    friends: IUserFriend[];

    createdAt: number;
    updatedAt: number;
}

export type IPublicUser = Omit<
    IUser,
    'name' |
    'email' |
    'passwordHash' |
    'friends' |
    'room' |
    'updatedAt'
>