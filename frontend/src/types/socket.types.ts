import { Socket } from "socket.io-client";
import type { IUser } from "./user.types";

// TODO
export interface ServerToClientEvents {
    /** For users NOT in a room */
    roomCreated: (roomId: string, roomName: string, memberCount: number, owner: IUser) => void;
    roomUpdated: (roomId: string) => void;
    roomDeleted: (roomId: string, roomName: string) => void;

    notification: () => void;

    /** For users IN a room */
    memberJoined: (userId: string) => void;
    memberLeft: (userId: string) => void;
    memberKicked: (userId: string, kickedBy: string, reason: string) => void;
    memberBanned: (userId: string, bannedBy: string, reason: string) => void;

    newMessage: (userId: string, message: string) => void;
    messageEdited: (userId: string, oldMessage: string, newMessage: string) => void;
    messageDeleted: (userId: string, deletedBy: string, message: string) => void;
}

// TODO
export interface ClientToServerEvents {
    roomJoined: (roomId: string, ack: (success: boolean) => void) => void;
    roomLeft: (roomId: string, ack: (success: boolean) => void) => void;

    sendMessage: (roomId: string, message: string, ack: (success: boolean) => void) => void;
}

// TODO
export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    user: {
        id: string,
        username: string,
        email: string,
    };
}

export type TalketeerSocket = Socket<ServerToClientEvents, ClientToServerEvents>;