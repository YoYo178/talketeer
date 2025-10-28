import { Router } from 'express';

import { validate } from '@src/middlewares';
import { GIFSearchSchema } from '@src/schemas';

import { getGIFs } from '@src/controllers';

const GIFRouter = Router();

GIFRouter.get('/', validate({ query: GIFSearchSchema }), getGIFs);

export default GIFRouter;