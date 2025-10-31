import { z } from 'zod';
import { mongooseObjectId } from '../utils';

export const notificationIdParams = z.object({
  notificationId: mongooseObjectId,
});

export type TNotificationIdParams = z.infer<typeof notificationIdParams>;