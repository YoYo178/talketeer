import { banUser, isUserBanned } from "@src/services/ban.service";
import { getRoom, isUserInRoom, leaveRoom } from "@src/services/room.service";
import { getUser } from "@src/services/user.service";
import { ClientToServerEvents, TalketeerSocket, TalketeerSocketServer } from "@src/types";
import logger from "@src/utils/logger.utils";

export const getBanFromRoomEventCallback = (io: TalketeerSocketServer, socket: TalketeerSocket): ClientToServerEvents['banFromRoom'] => {
    return async (roomId, userId, bannedBy, duration, reason, ack) => {
        if (!socket.data?.user) {
            logger.warn('Unauthenticated user attempted to ban a member from a room');
            return;
        }

        try {
            const room = await getRoom(roomId);

            if (!room)
                throw new Error('Room not found');

            const admin = await getUser(bannedBy);

            if (!admin)
                throw new Error('The person trying to ban the user cannot be found');

            if (bannedBy !== room.owner?.toString())
                throw new Error('You are not the admin of the room');

            const user = await getUser(userId);

            if (!user)
                throw new Error('The user you are trying to ban cannot be found');

            const isMember = await isUserInRoom(roomId, userId);

            if (!isMember)
                throw new Error('The user you are trying to ban is not a member of this room');

            const alreadyBanned = await isUserBanned(userId, roomId);

            if (alreadyBanned)
                throw new Error('The user you are trying to ban is already banned');

            // See ban.model.ts
            // Even if we accidentally set up both isPermanent as true, and expiresAt to a value
            // MongoDB will automatically set expiresAt to null because of the pre-save function
            const ban = await banUser({
                bannedBy,
                roomId,
                userId,
                reason,
                isPermanent: duration === -1,
                expiresAt: new Date(Date.now() + duration)
            })

            if (!ban)
                throw new Error('An error occured in the server while banning the user.')

            await leaveRoom(userId, roomId);

            const targetSocket = (await io.in(userId).fetchSockets())[0]
            targetSocket.leave(roomId);

            logger.info(`${admin.username} banned ${user.username} from ${room.name}`, {
                roomId,
                bannedBy,
                userId,
                duration,
                reason
            })

            io.emit(
                'memberBanned',
                roomId,
                userId,
                bannedBy,
                {
                    created: ban.createdAt.valueOf(),
                    expiry: ban.expiresAt?.valueOf() || null,
                    isPermanent: duration === -1,
                    reason
                },
            )

            io.emit('roomUpdated', roomId);

            ack({ success: true });
        } catch (err) {
            logger.error("Error banning member from room", {
                userId: socket.data.user.id,
                error: err?.message || 'Unknown error',
                stack: err instanceof Error ? err.stack : undefined
            });
            ack({
                success: false,
                error: err?.message || 'Unknown error'
            });
        }
    }
}