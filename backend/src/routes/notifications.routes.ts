import { Router } from 'express';

import { validate } from '@src/middlewares';
import { notificationIdParams } from '@src/schemas';

import { getNotifications, getNotification } from '@src/controllers';

const NotificationsRouter = Router();

NotificationsRouter.get('/', getNotifications);
NotificationsRouter.get('/:notificationId', validate({ params: notificationIdParams }), getNotification);

export default NotificationsRouter;