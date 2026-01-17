import { describe, it, expect } from 'vitest';
import { APIError } from '@src/utils/api.utils';
import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';

describe('APIError', () => {
    describe('constructor', () => {
        it('should create an APIError with message and status code', () => {
            const error = new APIError('Test error message', HTTP_STATUS_CODES.BadRequest);

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(APIError);
            expect(error.message).toBe('Test error message');
            expect(error.statusCode).toBe(400);
            expect(error.data).toEqual({});
        });

        it('should create an APIError with message, status code, and data', () => {
            const customData = { field: 'email', reason: 'invalid format' };
            const error = new APIError('Validation error', HTTP_STATUS_CODES.UnprocessableEntity, customData);

            expect(error.message).toBe('Validation error');
            expect(error.statusCode).toBe(422);
            expect(error.data).toEqual(customData);
        });

        it('should have a stack trace', () => {
            const error = new APIError('Error with stack', HTTP_STATUS_CODES.InternalServerError);

            expect(error.stack).toBeDefined();
            expect(error.stack).toContain('Error with stack');
        });

        it('should handle different HTTP status codes', () => {
            const testCases = [
                { code: HTTP_STATUS_CODES.Unauthorized, expected: 401 },
                { code: HTTP_STATUS_CODES.Forbidden, expected: 403 },
                { code: HTTP_STATUS_CODES.NotFound, expected: 404 },
                { code: HTTP_STATUS_CODES.Conflict, expected: 409 },
                { code: HTTP_STATUS_CODES.TooManyRequests, expected: 429 },
                { code: HTTP_STATUS_CODES.InternalServerError, expected: 500 },
            ];

            testCases.forEach(({ code, expected }) => {
                const error = new APIError('Test', code);
                expect(error.statusCode).toBe(expected);
            });
        });

        it('should handle empty data object when undefined', () => {
            const error = new APIError('No data', HTTP_STATUS_CODES.BadRequest, undefined);

            expect(error.data).toEqual({});
        });

        it('should preserve complex data objects', () => {
            const complexData = {
                errors: [
                    { field: 'email', message: 'Required' },
                    { field: 'password', message: 'Too short' },
                ],
                timestamp: new Date().toISOString(),
            };
            const error = new APIError('Multiple errors', HTTP_STATUS_CODES.BadRequest, complexData);

            expect(error.data).toEqual(complexData);
            expect(error.data.errors).toHaveLength(2);
        });
    });

    describe('inheritance', () => {
        it('should be catchable as a standard Error', () => {
            const throwError = () => {
                throw new APIError('Thrown error', HTTP_STATUS_CODES.BadRequest);
            };

            expect(throwError).toThrow(Error);
            expect(throwError).toThrow(APIError);
        });

        it('should have the correct name property', () => {
            const error = new APIError('Test', HTTP_STATUS_CODES.BadRequest);

            expect(error.name).toBe('Error'); // Inherits from Error
        });
    });
});
