import { Room, User } from '@src/models';
import { IRoom } from '@src/types';
import { getUser, updateUserRoom } from './user.service';

export async function getAllRooms(filter = {}): Promise<IRoom[]> {
    return Room.find(filter).lean().exec();
}

export async function getRoom(roomId: string): Promise<IRoom | null> {
    return Room.findById(roomId).lean().exec();
}

export async function getRoomByCode(code: string): Promise<IRoom | null> {
    return Room.findOne({ code }).lean().exec();
}

export async function createRoom(roomData: Partial<Omit<IRoom, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IRoom> {
    const newRoom = await Room.create({ ...roomData });
    return newRoom.toObject();
}

export async function updateRoom(roomId: string, newRoomData: Partial<IRoom>) {
    return Room.findByIdAndUpdate(roomId, { $set: newRoomData }, { new: true, lean: true }).exec();
}

export async function deleteRoom(roomId: string) {
    return Room.findByIdAndDelete(roomId).lean().exec();
}

export async function addUserToRoom(roomId: string, userId: string) {
    return Room.findByIdAndUpdate(
        roomId,
        {
            $inc: { memberCount: 1 },
            $push: {
                members: {
                    user: userId,
                    roomRole: 'member',
                    joinTimestamp: Date.now(),
                },
            },
        },
        { new: true, lean: true }
    ).exec();
}

export async function removeUserFromRoom(roomId: string, userId: string) {
    return Room.findByIdAndUpdate(
        roomId,
        { $inc: { memberCount: -1 }, $pull: { members: { user: userId } } },
        { new: true, lean: true }
    ).exec();
}

export async function isUserInRoom(roomId: string, userId: string): Promise<boolean> {
    const room = await Room.findOne({ _id: roomId, 'members.user': userId })
        .select('_id')
        .lean()
        .exec();
    return !!room;
}

export async function joinRoom(userId: string, roomId: string) {
    let user = await getUser(userId);
    if (!user) throw new Error('User not found');

    if (user.room?.toString() === roomId) return null;

    let room = await getRoom(roomId);
    if (!room) throw new Error('Room not found');

    const isAlreadyMember = await isUserInRoom(roomId, userId);

    if (!isAlreadyMember) {
        room = await addUserToRoom(roomId, userId)

        // Update user's current room
        user = await updateUserRoom(userId, roomId);
    }

    return { user, room };
}

export async function leaveRoom(userId: string, roomId: string) {
    let user = await getUser(userId);
    if (!user) throw new Error('User not found');

    if (!user.room?.toString() || user.room?.toString() != roomId) return null;

    let room = await getRoom(roomId);
    if (!room) throw new Error('Room not found');

    const isMember = await isUserInRoom(roomId, userId);

    if (isMember) {
        room = await removeUserFromRoom(roomId, userId);

        // Update user's current room
        user = await updateUserRoom(userId, null);
    }

    return { user, room };
}