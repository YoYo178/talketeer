import { leaveRoom } from "@src/services/room.service";
import { getUser } from "@src/services/user.service";
import { TalketeerSocket, TalketeerSocketServer } from "@src/types/socket.types";

export const getDisconnectEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket) => {
    return async (reason: string, description: string) => {
        if (!socket.data?.user) {
            console.log('Unauthenticated user');
            return;
        }

        console.log(`${socket.data.user.username} disconnected`);

        const userId = socket.data.user.id;

        const user = await getUser(userId);
        if (!user?.room) return;

        await leaveRoom(userId, user.room.toString());

        io.emit('roomUpdated', user.room.toString());
    }
}