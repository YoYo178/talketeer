import { ObjectId } from "mongoose";
import { IUser } from "./user.types";
import { IMessage } from "./message.types";
import { DBRef } from "./db.types";

export interface IRoomMember {
    user: DBRef<IUser>;
    roomRole: 'admin' | 'member';
    joinTimestamp: number;
}

export interface IRoom {
    _id: ObjectId;

    /** Room name */
    name: string;

    /** Room code */
    code: string;

    /** Room owner */
    owner: DBRef<IUser>

    /** Room members array */
    members: DBRef<IRoomMember[]>;

    /** Current member count of the room */
    currentMemberCount: number;

    /** Room messages array */
    messages: DBRef<IMessage[]>;

    /** Room member limit (2 > n > 10) */
    memberLimit: number;

    /** True for system generated rooms */
    isSystemGenerated: boolean;

    createdAt: number;
    updatedAt: number;
}