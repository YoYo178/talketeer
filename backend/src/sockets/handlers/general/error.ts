import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getErrorEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (err: unknown) => {
        console.error(`An error occured for ${socket.id}`);
        console.error(err);
    }
}