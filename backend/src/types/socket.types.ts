import { Server, Socket } from "socket.io";
import { IMessage } from "./message.types";
import { IRoom } from "./room.types";
import { INotification } from "./notification.types";

export interface ServerToClientEvents {
    /** For users NOT in a room */
    roomCreated: (room: IRoom) => void;
    roomUpdated: (roomId: string) => void;
    roomDeleted: (roomId: string, ownerId: string) => void;

    notification: (notification: INotification) => void;

    /** For users IN a room */
    memberJoined: (roomId: string, userId: string) => void;
    memberLeft: (roomId: string, userId: string) => void;
    memberKicked: (roomId: string, userId: string, kickedBy: string, reason: string) => void;
    memberBanned: (roomId: string, userId: string, bannedBy: string, banDetails: { created: number, expiry: number | null, isPermanent: boolean, reason: string }) => void;

    newMessage: (roomId: string, userId: string, message: IMessage) => void;
    messageEdited: (roomId: string, userId: string, oldMessage: string, newMessage: string) => void;
    messageDeleted: (roomId: string, userId: string, deletedBy: string, message: string) => void;

    memberOnline: (membersCount: number, userId: string) => void;
    memberOffline: (membersCount: number, userId: string) => void;
}

// This generic represents the data type that is to be sent with the ack, null by default
export type AckFunc<T = null> = (options: AckOptions<T>) => void;
export type AckOptions<T> = { success: boolean, data?: T, error?: string };

export interface ClientToServerEvents {
    createRoom: (name: string, visibility: 'public' | 'private', memberLimit: number, ack: AckFunc<IRoom>) => void;
    updateRoom: (roomId: string, name: string, visibility: 'public' | 'private', memberLimit: number, ack: AckFunc) => void;
    joinRoom: (payload: { method: 'code' | 'id', data: string }, ack: AckFunc<{ roomId: string, ban?: { created: number, expiry: number | null, isPermanent: boolean } }>) => void;
    leaveRoom: (roomId: string, ack: AckFunc) => void;
    deleteRoom: (roomId: string, ack: AckFunc) => void;

    sendMessage: (roomId: string, message: string, ack: AckFunc) => void;
    editMessage: (roomId: string, messageId: string, newContent: string, ack: AckFunc) => void;
    deleteMessage: (roomId: string, messageId: string, ack: AckFunc) => void;

    kickFromRoom: (roomId: string, userId: string, kickedBy: string, reason: string, ack: AckFunc) => void;
    banFromRoom: (roomId: string, userId: string, bannedBy: string, duration: number, reason: string, ack: AckFunc) => void;

    sendFriendRequest: (userId: string, ack: AckFunc) => void;
    revokeFriendRequest: (userId: string, ack: AckFunc) => void;
    acceptFriendRequest: (userId: string, ack: AckFunc) => void;
    declineFriendRequest: (userId: string, ack: AckFunc) => void;
    removeFriend: (userId: string, ack: AckFunc) => void;
}

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