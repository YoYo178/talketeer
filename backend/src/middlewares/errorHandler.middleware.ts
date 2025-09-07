import HttpStatusCodes from "@src/common/HttpStatusCodes"
import type { Request, Response, NextFunction } from "express"
import logger from "@src/utils/logger.utils";

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    logger.error('Express error handler caught an error', {
        error: err instanceof Error ? err.message : 'Unknown error',
        stack: err instanceof Error ? err.stack : undefined,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred in the server. Please try again.'
    });
}