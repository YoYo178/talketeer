import { DEFAULT_SYSTEM_ROOM_CONFIG, MAX_SYSTEM_ROOMS } from "@src/config";
import { Room } from "@src/models"
import { IRoom, IRoomPublicView } from "@src/types";
import logger from "./logger.utils";

export const populateRoomData = async () => {
    const rooms = await Room.find({ isSystemGenerated: true }).lean().exec();

    if (MAX_SYSTEM_ROOMS - rooms.length <= 0)
        return;

    logger.info('Generating system rooms...');

    for (let i = 0; i != MAX_SYSTEM_ROOMS; i++) {
        const roomCode = `tkt${String(i + 1).padStart(3, '0')}`;

        if (rooms.find(room => room.code === roomCode))
            continue;

        await Room.create({
            ...DEFAULT_SYSTEM_ROOM_CONFIG,
            name: `${DEFAULT_SYSTEM_ROOM_CONFIG.name} ${String(i + 1)}`,
            code: roomCode,
            owner: null, // TODO: owner is not nullable
        })

        logger.info(`Created room "${roomCode}" successfully.`)
    }
}

export function generateRoomCode(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

export function sanitizeRoomObj(room: IRoom, userID: string): IRoom | IRoomPublicView {
    const isUserInRoom = room.members.some(mem => mem.user.toString() === userID);

    if (!isUserInRoom) {
        return {
            ...room,
            code: undefined,
            owner: undefined,
            members: undefined,
            messages: undefined,
        };
    } else if (isUserInRoom) {
        return {
            ...room,
            messages: undefined
        }
    }

    return room;
}