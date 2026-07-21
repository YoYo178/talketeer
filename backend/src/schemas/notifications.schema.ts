import { z } from 'zod';
import { mongooseObjectId } from '../utils/schema.utils.js';

export const notificationIdParams = z.object({
  notificationId: mongooseObjectId,
});

export type TNotificationIdParams = z.infer<typeof notificationIdParams>;