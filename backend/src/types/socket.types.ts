import { ObjectId } from "mongoose";
import { Server, Socket } from "socket.io";
import { IUser } from "./user.types";

// TODO
export interface ServerToClientEvents {
    roomCreated: (roomId: string, roomName: string, memberCount: number, owner: IUser) => void;

    roomUpdated: (roomId: string) => void;
    roomDeleted: (roomId: string, roomName: string) => void;

    memberJoined: (userId: string, userName: string) => void;
    memberLeft: (userId: string, userName: string) => void;

    memberKicked: (userId: string, userName: string, reason: string) => void;
    memberBanned: (userId: string, userName: string, reason: string) => void;

    newMessage: (roomId: string, userId: string, message: string) => void;
}

// TODO
export interface ClientToServerEvents {
    roomJoined: (userId: string, roomId: string, ack: (success: boolean) => void) => void;
    roomLeft: (userId: string, roomId: string, ack: (success: boolean) => void) => void;

    sendMessage: (roomId: string, userId: string, message: string, ack: (success: boolean) => void) => void;
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

export type TalketeerSocketServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type TalketeerSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;