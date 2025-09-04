import { Server, Socket } from "socket.io";
import { IUser } from "./user.types";
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
    memberJoined: (userId: string) => void;
    memberLeft: (userId: string) => void;
    memberKicked: (userId: string, kickedBy: string, reason: string) => void;
    memberBanned: (userId: string, bannedBy: string, reason: string) => void;

    newMessage: (roomId: string, userId: string, message: string, rawMessage?: IMessage) => void;
    messageEdited: (roomId: string, userId: string, oldMessage: string, newMessage: string) => void;
    messageDeleted: (roomId: string, userId: string, deletedBy: string, message: string) => void;
}

// TODO
export interface ClientToServerEvents {
    createRoom: (name: string, visibility: 'public' | 'private', memberLimit: number, ack: (success: boolean) => void) => void;
    updateRoom: (roomId: string, newRoomData: Partial<Omit<IRoom, '_id'>>, ack: (success: boolean) => void) => void;
    joinRoom: (roomId: string, ack: (success: boolean) => void) => void;
    leaveRoom: (roomId: string, ack: (success: boolean) => void) => void;
    deleteRoom: (roomId: string, ack: (success: boolean) => void) => void;

    sendMessage: (roomId: string, message: string, ack: (success: boolean) => void) => void;
    editMessage: (roomId: string, messageId: string, newContent: string, ack: (success: boolean) => void) => void;
    deleteMessage: (roomId: string, messageId: string, ack: (success: boolean) => void) => void;
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