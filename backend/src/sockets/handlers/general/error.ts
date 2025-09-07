import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import logger from "@src/utils/logger.utils";

export const getErrorEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (err: unknown) => {
        logger.error(`Socket error for ${socket.id}`, {
            socketId: socket.id,
            userId: socket.data?.user?.id,
            username: socket.data?.user?.username,
            error: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : undefined
        });
    }
}