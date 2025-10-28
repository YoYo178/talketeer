import { TalketeerSocket, TalketeerSocketServer } from "@src/types";
import logger from "@src/utils/logger.utils";

export const getDisconnectingEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (reason: string, description: string) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user disconnecting', { reason, description });
            return;
        }

        logger.info(`${socket.data.user.id} disconnecting`, {
            userId: socket.data.user.id,
            reason,
            description
        });
    }
}