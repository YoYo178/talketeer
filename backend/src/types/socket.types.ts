import { Server, Socket } from "socket.io";
import { IMessage } from "./message.types";
import { IRoom } from "./room.types";

// TODO
export interface ServerToClientEvents {
    /** For users NOT in a room */
    roomCreated: (room: IRoom) => void;
    roomUpdated: (roomId: string) => void;
    roomDeleted: (roomId: string) => void;

    notification: () => void;

    /** For users IN a room */
    memberJoined: (roomId: string, userId: string) => void;
    memberLeft: (roomId: string, userId: string) => void;
    memberKicked: (roomId: string, userId: string, kickedBy: string, reason: string) => void;
    memberBanned: (roomId: string, userId: string, bannedBy: string, reason: string) => void;

    newMessage: (roomId: string, userId: string, message: string, rawMessage?: IMessage) => void;
    messageEdited: (roomId: string, userId: string, oldMessage: string, newMessage: string) => void;
    messageDeleted: (roomId: string, userId: string, deletedBy: string, message: string) => void;
}

export type AckOptions<T> = { success: boolean, data?: T, error?: string };
export type AckFunc<T = null> = (options: AckOptions<T>) => void;

// TODO
export interface ClientToServerEvents {
    createRoom: (name: string, visibility: 'public' | 'private', memberLimit: number, ack: AckFunc) => void;
    updateRoom: (roomId: string, newRoomData: Partial<Omit<IRoom, '_id'>>, ack: AckFunc) => void;
    joinRoom: (payload: { method: 'code' | 'id', data: string }, ack: AckFunc<string>) => void;
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

export interface SocketData {
    user: {
        id: string,
        username: string,
        email: string,
    };
}

export type TalketeerSocketServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export type TalketeerSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;