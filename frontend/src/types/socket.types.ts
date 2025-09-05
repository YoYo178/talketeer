import { Socket } from "socket.io-client";
import type { IMessage } from "./message.types";
import type { IRoom } from "./room.types";

// TODO
export interface ServerToClientEvents {
    /** For users NOT in a room */
    roomCreated: (room: IRoom) => void;
    roomUpdated: (roomId: string) => void;
    roomDeleted: (roomId: string) => void;

    notification: () => void;

    /** For users IN a room */
    memberJoined: (userId: string) => void;
    memberLeft: (userId: string) => void;
    memberKicked: (userId: string, kickedBy: string, reason: string) => void;
    memberBanned: (userId: string, bannedBy: string, reason: string) => void;

    newMessage: (roomId: string, userId: string, message: string, rawMessage?: IMessage) => void;
    messageEdited: (roomId: string, userId: string, oldMessage: string, newMessage: string) => void;
    messageDeleted: (roomId: string, userId: string, deletedBy: string, message: string) => void;
}

export type AckFunc = (success: boolean, error?: string) => void;

// TODO
export interface ClientToServerEvents {
    createRoom: (name: string, visibility: 'public' | 'private', memberLimit: number, ack: AckFunc) => void;
    updateRoom: (roomId: string, newRoomData: Partial<Omit<IRoom, '_id'>>, ack: AckFunc) => void;
    joinRoom: (roomId: string, ack: AckFunc) => void;
    leaveRoom: (roomId: string, ack: AckFunc) => void;
    deleteRoom: (roomId: string, ack: AckFunc) => void;

    sendMessage: (roomId: string, message: string, ack: AckFunc) => void;
    editMessage: (roomId: string, messageId: string, newContent: string, ack: AckFunc) => void;
    deleteMessage: (roomId: string, messageId: string, ack: AckFunc) => void;
}

// TODO
export interface InterServerEvents {
    ping: () => void;
}

export type TalketeerSocket = Socket<ServerToClientEvents, ClientToServerEvents>;