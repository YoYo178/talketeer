import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getDisconnectingEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (reason: string, description: string) => {
        if (!socket.data?.user) {
            console.log('Unauthenticated user');
            return;
        }
        
        console.log(`${socket.data.user.username} disconnecting`);
    }
}