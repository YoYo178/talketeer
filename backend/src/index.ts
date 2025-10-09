/** Node packages */
import fs from 'fs'
import path from 'path';

/** Server packages */
import http from 'http';
import https from 'https';
import express, { Request, Response, NextFunction } from 'express';
import { Server as SocketIOServer } from 'socket.io';

/** Middleware libraries */
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

/** Constants and Environment variables */
import ENV from '@src/common/ENV';
import { NodeEnvs } from '@src/common/constants';

/** Configuration objects */
import { ASSETS_PATH, CORSConfig } from '@src/config';

/** Middlewares */
import { errorHandler } from '@src/middlewares';

/** Routes */
import APIRouter from '@src/routes';

/** Socket handlers */
import { setupSocket } from '@src/sockets/socket';

/** Types */
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, TalketeerSocketServer } from '@src/types';

/** Utilities */
import { connectDB, populateRoomData, morganStream } from '@src/utils'
import logger from '@src/utils/logger.utils';

// ==========================================================================================================

// Connect to MongoDB
connectDB()

// Create express app
const app = express();

// HTTPS config
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

const shouldUseHttps = ENV.NodeEnv === 'development' && (SSL_KEY_PATH && SSL_CERT_PATH)

const httpsOptions = shouldUseHttps
  ? {
    key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
    cert: fs.readFileSync(path.resolve(SSL_CERT_PATH))
  }
  : {}

// Create server, use HTTPS if the environment is development
const server = shouldUseHttps ? https.createServer(httpsOptions, app) : http.createServer(app);

// Setup Socket.IO on the same server object
const io: TalketeerSocketServer = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: CORSConfig,
  serveClient: false
});

// Add socket event listeners
setupSocket(io);

// Attach middlewares
app.use(cors(CORSConfig)) // CORS
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
app.use(cookieParser()) // Cookie parser

// Attach logger middleware
if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}

// Attach security middleware, only in production!
if (ENV.NodeEnv === NodeEnvs.Production) {
  // eslint-disable-next-line n/no-process-env
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use('/assets', express.static(path.join(ASSETS_PATH)));

// Attach IO instance via express middleware
app.use((req: Request, _res: Response, next: NextFunction) => { req.io = io; next(); });

// Attach main API router
app.use('/api', APIRouter);

// Attach error handler middleware
app.use(errorHandler);

// Start the server
server.listen(ENV.Port, () => {
  logger.info('Express server started on port: ' + ENV.Port.toString());

  // Generate system rooms, if any of them are missing
  populateRoomData();
});
