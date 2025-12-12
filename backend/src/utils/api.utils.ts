import { HttpStatusCodes } from '@src/common/HTTP_STATUS_CODES';

export class APIError extends Error {
  public statusCode: HttpStatusCodes | null = null;
  public data: Record<string, unknown> = {};

  public constructor(message: string, statusCode: HttpStatusCodes, data?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.data = data ?? {};

    Error.captureStackTrace(this, this.constructor);
  }
}