import type { IMessage } from "./message.types";

export interface IRoomMember {
    user: string; // TODO: IPublicUser
    roomRole: 'admin' | 'member';
    joinTimestamp: number;
}

export interface IRoom {
    _id: string;

    /** Room name */
    name: string;

    /** Room code */
    code: string;

    /** Room owner */
    owner: string // TODO: IPublicUser

    /** Room members array */
    members: IRoomMember[];

    /** Room messages array */
    messages: IMessage[];

    /** Room member limit (2 > n > 10) */
    memberLimit: number;

    /** True for system generated rooms */
    isSystemGenerated: boolean;

    createdAt: number;
    updatedAt: number;
}


