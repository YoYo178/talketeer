import { Router } from 'express';

import { validate } from '@src/middlewares';
import { messagesQuerySchema, messageIdParamsSchema } from '@src/schemas';

import { getMessages, getMessageById, getDmMessages, getDmMessageById } from '@src/controllers';

const MessagesRouter = Router();

MessagesRouter.get('/dm', validate({ query: messagesQuerySchema }), getDmMessages);
MessagesRouter.get('/dm/:messageId', validate({ params: messageIdParamsSchema }), getDmMessageById);

MessagesRouter.get('/', validate({ query: messagesQuerySchema }), getMessages);
MessagesRouter.get('/:messageId', validate({ params: messageIdParamsSchema }), getMessageById);

export default MessagesRouter;