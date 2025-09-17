import HttpStatusCodes from "@src/common/HttpStatusCodes";

export class APIError extends Error {
    public statusCode: HttpStatusCodes | null = null;

    constructor(message: string, statusCode: HttpStatusCodes) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}