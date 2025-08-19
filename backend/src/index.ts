import http from 'http';
import logger from 'jet-logger';
import { Server as SocketIOServer } from 'socket.io';

import ENV from '@src/common/ENV';
import app from './server';

import { connectDB, CORSConfig } from './config';
import { setupSocket } from './sockets/socket';
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from './types';
import { populateRoomData } from './utils/room.utils';

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

const server = http.createServer(app);

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
