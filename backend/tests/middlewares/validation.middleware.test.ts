import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { validate } from '@src/middlewares/validation.middleware';

describe('Validation Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: ReturnType<typeof vi.fn>;
    let statusMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        jsonMock = vi.fn();
        statusMock = vi.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {
            body: {},
            query: {},
            params: {},
        };

        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };

        mockNext = vi.fn();
    });

    describe('body validation', () => {
        const bodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(6),
        });

        it('should call next() when body is valid', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
            };

            const middleware = validate({ body: bodySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });

        it('should update req.body with parsed data', () => {
            mockRequest.body = {
                email: 'test@example.com',
                password: 'password123',
                extraField: 'should be stripped',
            };

            const middleware = validate({ body: bodySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockRequest.body).toEqual({
                email: 'test@example.com',
                password: 'password123',
            });
        });

        it('should return 400 when body is invalid', () => {
            mockRequest.body = {
                email: 'invalid-email',
                password: '123', // too short
            };

            const middleware = validate({ body: bodySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Validation failed',
                })
            );
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 400 when required body field is missing', () => {
            mockRequest.body = {
                email: 'test@example.com',
                // password is missing
            };

            const middleware = validate({ body: bodySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('query validation', () => {
        const querySchema = z.object({
            page: z.coerce.number().min(1).default(1),
            limit: z.coerce.number().min(1).max(100).default(10),
        });

        it('should call next() when query is valid', () => {
            mockRequest.query = {
                page: '2',
                limit: '20',
            };

            const middleware = validate({ query: querySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should apply default values to query', () => {
            mockRequest.query = {};

            const middleware = validate({ query: querySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockRequest.query).toMatchObject({
                page: 1,
                limit: 10,
            });
        });

        it('should return 400 when query is invalid', () => {
            mockRequest.query = {
                page: '-1', // invalid: less than 1
                limit: '200', // invalid: greater than 100
            };

            const middleware = validate({ query: querySchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('params validation', () => {
        const paramsSchema = z.object({
            id: z.string().min(24).max(24), // MongoDB ObjectId length
        });

        it('should call next() when params are valid', () => {
            mockRequest.params = {
                id: '507f1f77bcf86cd799439011',
            };

            const middleware = validate({ params: paramsSchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 400 when params are invalid', () => {
            mockRequest.params = {
                id: 'invalid-id', // too short
            };

            const middleware = validate({ params: paramsSchema });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('combined validation', () => {
        const bodySchema = z.object({
            name: z.string().min(1),
        });

        const querySchema = z.object({
            includeDetails: z.coerce.boolean().default(false),
        });

        const paramsSchema = z.object({
            id: z.string().min(1),
        });

        it('should validate body, query, and params together', () => {
            mockRequest.body = { name: 'Test' };
            mockRequest.query = { includeDetails: 'true' };
            mockRequest.params = { id: '123' };

            const middleware = validate({
                body: bodySchema,
                query: querySchema,
                params: paramsSchema,
            });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('should fail if any validation fails', () => {
            mockRequest.body = { name: '' }; // invalid: empty
            mockRequest.query = { includeDetails: 'true' };
            mockRequest.params = { id: '123' };

            const middleware = validate({
                body: bodySchema,
                query: querySchema,
                params: paramsSchema,
            });
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(mockNext).not.toHaveBeenCalled();
        });
    });

    describe('no validation schemas', () => {
        it('should call next() when no schemas are provided', () => {
            const middleware = validate({});
            middleware(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });
});
