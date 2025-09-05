import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getDisconnectingEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (reason: string, description: string) => {
        console.log(`${socket.data.user.username} disconnecting`);
    }
}