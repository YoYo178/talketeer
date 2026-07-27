import { Router } from 'express';

import { validate } from '@src/middlewares/validation.middleware.js';
import { GIFSearchSchema } from '@src/schemas/gif.schema.js';

import { getGIFs } from '@src/controllers/gif.controller.js';

const GIFRouter = Router();

GIFRouter.get('/', validate({ query: GIFSearchSchema }), getGIFs);

export default GIFRouter;
