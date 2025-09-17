import mongoose from "mongoose";
import { IUser } from "./user.types";
import { IMessage } from "./message.types";
import { DBRef } from "./db.types";

export interface IRoomMember {
    user: DBRef<IUser>;
    roomRole: 'admin' | 'member';
    joinTimestamp: number;
}

export interface IRoom {
    _id: mongoose.Types.ObjectId;

    /** Room name */
    name: string;

    /** Room code */
    code: string;

    /** Room owner */
    owner: DBRef<IUser> | null;

    /** Room members array */
    members: IRoomMember[];

    /** Room messages array */
    messages: DBRef<IMessage>[];

    /** Number of members currently in the room */
    memberCount: number;

    /** Room member limit (2 > n > 10) */
    memberLimit: number;

    /** True for system generated rooms */
    isSystemGenerated: boolean;

    /** Room's visibility */
    visibility: 'public' | 'private';

    createdAt: number;
    updatedAt: number;
}

export type IRoomPublicView = Omit<IRoom, 'code' | 'members' | 'messages'>;