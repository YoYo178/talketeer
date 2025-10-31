import mongoose from 'mongoose';

export interface IBan {
    _id: mongoose.Types.ObjectId;

    /** The user that was banned */
    userId: mongoose.Types.ObjectId;

    /** The user who banned the other user */
    bannedBy: mongoose.Types.ObjectId;

    /** The room this user was banned in */
    roomId: mongoose.Types.ObjectId;

    /** The reason for which this user was banned */
    reason?: string;

    /** True if the ban is permanent */
    isPermanent: boolean;

    /** Ban expire time */
    expiresAt?: Date | null;

    createdAt: Date;
}