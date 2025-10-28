import HttpStatusCodes from '@src/common/HttpStatusCodes';

export class APIError extends Error {
  public statusCode: HttpStatusCodes | null = null;
  public data: Record<any, any> = {};

  constructor(message: string, statusCode: HttpStatusCodes, data?: Record<any, any>) {
    super(message);
    this.statusCode = statusCode;
    this.data = data || {};

    Error.captureStackTrace(this, this.constructor);
  }
}