import { TalketeerSocketServer } from "@src/types";

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