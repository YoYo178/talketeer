import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import ENV from '@src/common/ENV';
import { NodeEnvs } from '@src/common/constants';


import { CORSConfig } from './config';
import { errorHandler } from './middlewares';
import APIRouter from './routes';

/******************************************************************************
                                Setup
******************************************************************************/

const app = express();


// **** Middleware **** //

app.use(cors(CORSConfig))

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser())

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use('/api', APIRouter);
app.use(errorHandler);

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
