/** Node packages */
import fs from "fs";
import path from "path";

/** Server packages */
import http from "http";
import https from "https";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { Server as SocketIOServer } from "socket.io";

/** Middleware libraries */
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

/** Constants and Environment variables */
import ENV, { NODE_ENVS } from "@src/common/env.js";

/** Configuration objects */
import { ASSETS_PATH } from "@src/config/files.config.js";
import { CORSConfig } from "@src/config/cors.config.js";

/** Middlewares */
import { errorHandler } from "@src/middlewares/errorHandler.middleware.js";

/** Routes */
import APIRouter from "@src/routes/index.js";

/** Socket handlers */
import { setupSocket } from "@src/sockets/socket.js";

/** Types */
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
  TalketeerSocketServer,
} from "@src/types/socket.types.js";

/** Utilities */
import { connectDB } from "@src/utils/db.utils.js";
import { populateRoomData } from "@src/utils/room.utils.js";
import logger, { morganStream } from "@src/utils/logger.utils.js";

// ==========================================================================================================

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// HTTPS config
const SSL_KEY_PATH = ENV.SSL_KEY_PATH;
const SSL_CERT_PATH = ENV.SSL_CERT_PATH;

const shouldUseHttps =
  ENV.NODE_ENV === "development" && SSL_KEY_PATH && SSL_CERT_PATH;

const httpsOptions = shouldUseHttps
  ? {
      key: fs.readFileSync(path.resolve(SSL_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(SSL_CERT_PATH)),
    }
  : {};

// Create server, use HTTPS if the environment is development
const server = shouldUseHttps
  ? https.createServer(httpsOptions, app)
  : http.createServer(app);

// Setup Socket.IO on the same server object
const io: TalketeerSocketServer = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: CORSConfig,
  serveClient: false,
});

// Add socket event listeners
setupSocket(io);

// Attach middlewares
app.use(cors(CORSConfig)); // CORS
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser
app.use(cookieParser()); // Cookie parser

// Attach logger middleware
if (ENV.NODE_ENV === NODE_ENVS.DEVELOPMENT) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined", { stream: morganStream }));
}

// Attach security middleware, only in production!
if (ENV.NODE_ENV === NODE_ENVS.PRODUCTION) {
  if (!ENV.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use(
  "/assets",
  (_: Request, res: Response, next: NextFunction) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(ASSETS_PATH)),
);

// Handle missing static files
app.use("/assets", (_, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Attach IO instance via express middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.io = io;
  next();
});

// Attach main API router
app.use("/api", APIRouter);

// Attach error handler middleware
app.use(errorHandler);

// Start the server
server.listen(ENV.PORT, () => {
  logger.info("Express server started on port: " + ENV.PORT.toString());

  // Generate system rooms, if any of them are missing
  populateRoomData();
});
