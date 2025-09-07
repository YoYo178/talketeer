import { leaveRoom } from "@src/services/room.service";
import { getUser } from "@src/services/user.service";
import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";
import logger from "@src/utils/logger.utils";

export const getDisconnectEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (reason: string, description: string) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user disconnected', { reason, description });
            return;
        }

        logger.info(`${socket.data.user.username} disconnected`, {
            userId: socket.data.user.id,
            reason,
            description
        });

        const userId = socket.data.user.id;

        const user = await getUser(userId);
        if (!user?.room) return;

        await leaveRoom(userId, user.room.toString());

        io.emit('roomUpdated', user.room.toString());
    }
}