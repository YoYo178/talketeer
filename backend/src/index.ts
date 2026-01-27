import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import ENV from '@src/common/ENV';
import { NODE_ENVS } from '@src/common/constants';
import { ASSETS_PATH, CORSConfig } from '@src/config';
import { errorHandler } from '@src/middlewares';
import APIRouter from '@src/routes';
import { setupSocket } from '@src/sockets/socket';

import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, TalketeerSocketServer } from '@src/types';

import { connectDB, populateRoomData, morganStream } from '@src/utils';
import logger from '@src/utils/logger.utils';


connectDB();

const app = express();

const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const shouldUseHttps = ENV.NodeEnv === 'development' && (SSL_KEY_PATH && SSL_CERT_PATH);

const httpsOptions = shouldUseHttps
  ? {
    key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(SSL_CERT_PATH)),
  }
  : {};

const server = shouldUseHttps ? https.createServer(httpsOptions, app) : http.createServer(app);

const io: TalketeerSocketServer = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: CORSConfig,
  serveClient: false,
});

setupSocket(io);

app.use(cors(CORSConfig)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (ENV.NodeEnv === NODE_ENVS.Dev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}

if (ENV.NodeEnv === NODE_ENVS.Production) {
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use(
  '/assets',
  (_: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(ASSETS_PATH)),
);

app.use('/assets', (_, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((req: Request, _res: Response, next: NextFunction) => { req.io = io; next(); });

app.use('/api', APIRouter);

app.use(errorHandler);

server.listen(ENV.Port, () => {
  logger.info('Express server started on port: ' + ENV.Port.toString());

  populateRoomData();
});