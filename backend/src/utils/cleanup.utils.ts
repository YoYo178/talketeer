import { Message } from '@src/models';
import logger from './logger.utils';

/**
 * Hard delete messages that have been soft-deleted for more than the retention period
 * Default retention: 30 days
 */
export async function cleanupDeletedMessages(retentionDays = 30): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await Message.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: cutoffDate },
    });

    logger.info(`Cleaned up ${result.deletedCount} soft-deleted messages older than ${retentionDays} days`, {
      service: 'cleanup-job',
      deletedCount: result.deletedCount,
      retentionDays,
    });

    return result.deletedCount;
  } catch (err) {
    logger.error('Error cleaning up deleted messages', {
      service: 'cleanup-job',
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err;
  }
}
