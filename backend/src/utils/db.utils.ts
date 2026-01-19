import ENV from '@src/common/ENV';
import { Room } from '@src/models/room.model';
import { User } from '@src/models/user.model';
import mongoose from 'mongoose';
import logger from '@src/utils/logger.utils';
import { cleanupDeletedMessages } from './cleanup.utils';

async function clearStaleData() {
  try {
    logger.info('Attempting to clear stale data from the database...');

    // Clear all members in all rooms
    await Room.updateMany({}, { $set: { members: [], memberCount: 0 } });

    // Clear users' room references
    await User.updateMany({}, { $unset: { room: '' } });

    // Clean up old soft-deleted messages
    await cleanupDeletedMessages();

    logger.info('Cleared stale data from the database.');
  } catch (e) {
    logger.error('Error occurred while attempting to clear stale data', {
      error: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined,
    });
  }
}

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MongodbUri);
    logger.info('Connected to MongoDB successfully.');
    clearStaleData();
  } catch (error) {
    logger.error('Couldn\'t connect to MongoDB', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};