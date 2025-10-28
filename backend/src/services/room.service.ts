import { DMRoom, Room } from '@src/models';
import { IRoom } from '@src/types';
import { getUser, updateUserRoom } from './user.service';
import mongoose from 'mongoose';

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

export async function addUserToRoom(roomId: string, userId: string, isAdmin?: boolean) {
  return Room.findByIdAndUpdate(
    roomId,
    {
      $inc: { memberCount: 1 },
      $push: {
        members: {
          user: userId,
          roomRole: isAdmin ? 'admin' : 'member',
          joinTimestamp: Date.now(),
        },
      },
    },
    { new: true, lean: true, session: undefined }, // Remove session for now, will be handled by transaction
  ).exec();
}

export async function removeUserFromRoom(roomId: string, userId: string) {
  return Room.findByIdAndUpdate(
    roomId,
    { $inc: { memberCount: -1 }, $pull: { members: { user: userId } } },
    { new: true, lean: true, session: undefined }, // Remove session for now, will be handled by transaction
  ).exec();
}

export async function isUserInRoom(roomId: string, userId: string): Promise<boolean> {
  const room = await Room.findOne({ _id: roomId, 'members.user': userId })
    .select('_id')
    .lean()
    .exec();
  return !!room;
}

export async function isUserRoomOwner(userId: string, roomId: string): Promise<boolean> {
  const room = await Room.findOne({ _id: roomId, owner: userId })
    .select('_id')
    .lean()
    .exec();
  return !!room;
}

export async function joinRoom(userId: string, roomId: string, isAdmin?: boolean) {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
      let user = await getUser(userId);
      if (!user) throw new Error('User not found');

      if (user.room?.toString() === roomId) return null;

      let room = await getRoom(roomId);
      if (!room) throw new Error('Room not found');

      const isAlreadyMember = await isUserInRoom(roomId, userId);

      if (!isAlreadyMember) {
        room = await addUserToRoom(roomId, userId, isAdmin);

        // Update user's current room
        user = await updateUserRoom(userId, roomId);
      }

      return { user, room };
    });
  } catch (error) {
    throw new Error(`Failed to join room: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    await session.endSession();
  }
}

export async function leaveRoom(userId: string, roomId: string) {
  const session = await mongoose.startSession();

  try {
    return await session.withTransaction(async () => {
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
    });
  } catch (error) {
    throw new Error(`Failed to leave room: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    await session.endSession();
  }
}

// this function re-activates a DM room if it exists, or creates a new one
export async function checkDMRoom(userId: string, otherUserId: string) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);

  const existingRoom = await DMRoom.findOne({ members: { $all: [userObjectId, otherUserObjectId] } }).lean().exec();

  if (!!existingRoom) {
    const updatedRoom = await DMRoom.findOneAndUpdate({ _id: existingRoom._id }, { isActive: true }, { lean: true, new: true }).exec();
    return updatedRoom;
  } else {
    const room = await DMRoom.create({
      members: [userObjectId, otherUserObjectId],
      messages: [],
      isActive: true,
    });

    return room.toObject();
  }
}

export async function deactivateDMRoom(userId: string, otherUserId: string) {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const otherUserObjectId = new mongoose.Types.ObjectId(otherUserId);

  const room = await DMRoom.findOneAndUpdate(
    { members: { $all: [userObjectId, otherUserObjectId] } },
    {
      $set: { isActive: false },
    },
    { new: true, upsert: true, lean: true },
  ).exec();

  return room;
}