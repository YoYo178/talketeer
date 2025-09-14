import { Types } from "mongoose";
import { DBRef } from "./db.types";
import { IUser } from "./user.types";
import { IRoom } from "./room.types";

export interface IBan {
    _id: Types.ObjectId;

    /** The user that was banned */
    userId: DBRef<IUser>;

    /** The user who banned the other user */
    bannedBy: DBRef<IUser>;

    /** The room this user was banned in */
    roomId: DBRef<IRoom>;

    /** The reason for which this user was banned */
    reason?: string;

    /** True if the ban is permanent */
    isPermanent: boolean;

    /** Ban expire time */
    expiresAt?: Date | null;

    createdAt: Date;
}