import { Ban } from '@src/models';
import { IBan } from '@src/types';

export async function getBans(roomId: string): Promise<IBan[]> {
  return Ban.find({ roomId }).lean().exec();
}

export async function getBan(userId: string, roomId: string) {
  return Ban.findOne({ userId, roomId }).lean().exec();
}

export async function banUser(banData: Omit<IBan, '_id' | 'createdAt'>) {
  const userId = banData.userId.toString();
  const roomId = banData.roomId.toString();

  const isBanned = await isUserBanned(userId, roomId);

  if (isBanned)
    return getBan(userId, roomId);

  const newBan = await Ban.create({ ...banData });
  return newBan.toObject();
}

export async function unbanUser(userId: string, roomId: string) {
  const isBanned = await isUserBanned(userId, roomId);

  if (!isBanned)
    return;

  await Ban.deleteOne({ userId, roomId });
}

export async function isUserBanned(userId: string, roomId: string): Promise<boolean> {
  const ban = await Ban.findOne({ userId, roomId })
    .select('_id')
    .lean()
    .exec();
  return !!ban;
}