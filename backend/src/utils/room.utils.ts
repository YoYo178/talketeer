import { DEFAULT_SYSTEM_ROOM_CONFIG, MAX_SYSTEM_ROOMS } from "@src/config";
import { Room } from "@src/models"

export const populateRoomData = async () => {
    const rooms = await Room.find({ isSystemGenerated: true }).lean().exec();
    const roomsToBeGenerated = MAX_SYSTEM_ROOMS - rooms.length;

    if (roomsToBeGenerated <= 0)
        return;

    console.info('Populating rooms data...');
    console.info('Rooms to be generated:', roomsToBeGenerated);

    for (let i = 0; i != roomsToBeGenerated; i++) {
        const roomCode = `tkt${String(i + 1).padStart(3, '0')}`;

        if (rooms.find(room => room.code === roomCode))
            continue;

        await Room.create({
            ...DEFAULT_SYSTEM_ROOM_CONFIG,
            name: `${DEFAULT_SYSTEM_ROOM_CONFIG.name} ${String(i + 1)}`,
            code: roomCode,
            owner: null, // TODO: owner is not nullable
        })

        console.info(`Created room "${roomCode}" successfully.`)
    }
}