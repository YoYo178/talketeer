import { Router } from 'express';

import { validate } from '@src/middlewares/validation.middleware.js';
import { notificationIdParams } from '@src/schemas/notifications.schema.js';

import { getNotifications, getNotification } from '@src/controllers/notifications.controller.js';

const NotificationsRouter = Router();

NotificationsRouter.get('/', getNotifications);
NotificationsRouter.get('/:notificationId', validate({ params: notificationIdParams }), getNotification);

export default NotificationsRouter;