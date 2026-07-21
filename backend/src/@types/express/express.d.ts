import type { TalketeerSocketServer } from '@src/types/index.js';

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string,
                username: string,
                email: string,
            };
            io: TalketeerSocketServer;

        }
    }
}