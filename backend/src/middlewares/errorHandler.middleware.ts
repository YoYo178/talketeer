import HttpStatusCodes from '@src/common/HttpStatusCodes';
import type { Request, Response, NextFunction } from 'express';

import { APIError } from '@src/utils';
import logger from '@src/utils/logger.utils'; // Default export, need to be imported separately

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof APIError) {
    // Log to debug level because if it's an instance of APIError, then it's probably expected
    logger.debug('Express error handler handled an API error', {
      error: err.message ?? 'Unknown error',
      statusCode: err.statusCode,
      stack: err.stack ?? undefined,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    res.status(err.statusCode ?? HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message,
      ...(Object.keys(err.data).length > 0 ? { data: err.data } : {}),
    });

    return;
  }

  logger.error('Express error handler caught an error', {
    error: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'An error occurred in the server. Please try again.',
  });
};