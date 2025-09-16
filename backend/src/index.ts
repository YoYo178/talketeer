import https from 'https';
import http from 'http';
import logger from 'jet-logger';
import fs from 'fs'
import { Server as SocketIOServer } from 'socket.io';

import ENV from '@src/common/ENV';
import app from './server';

import { connectDB, CORSConfig } from './config';
import { setupSocket } from './sockets/socket';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types';
import { populateRoomData } from './utils/room.utils';
import path from 'path';

/******************************************************************************
                                Constants
******************************************************************************/

const SERVER_START_MSG = (
  'Express server started on port: ' + ENV.Port.toString()
);


/******************************************************************************
                                  Run
******************************************************************************/

connectDB()

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

// Server initialization, use HTTPS if development environment
const server = shouldUseHttps ? https.createServer(httpsOptions, app) : http.createServer(app);

// Setup Socket.IO on the same server
const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
  cors: CORSConfig,
  serveClient: false
});

setupSocket(io);

// Start the server
server.listen(ENV.Port, () => {
  logger.info(SERVER_START_MSG);

  populateRoomData();
});
