import { TalketeerSocketServer } from '@src/types';

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
    }
    interface Request {
      io: TalketeerSocketServer;
    }
  }
}