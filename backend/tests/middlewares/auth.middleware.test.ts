import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Mock dependencies
const mockUserFindById = vi.fn();

vi.mock('@src/models', () => ({
    User: {
        findById: (...args: unknown[]) => mockUserFindById(...args),
    },
}));

vi.mock('@src/utils', () => ({
    generateAccessToken: vi.fn().mockReturnValue('new-access-token'),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
    APIError: class APIError extends Error {
        statusCode: number;
        constructor(message: string, statusCode: number) {
            super(message);
            this.statusCode = statusCode;
        }
    },
}));

vi.mock('@src/config', () => ({
    cookieConfig: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    },
    tokenConfig: {
        accessToken: {
            expiry: 900000, // 15 minutes
        },
        refreshToken: {
            expiry: 604800000, // 7 days
        },
    },
}));

// Import after mocking
import { requireAuth } from '@src/middlewares/auth.middleware';
import { verifyAccessToken, verifyRefreshToken } from '@src/utils';

describe('Auth Middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
    let jsonMock: ReturnType<typeof vi.fn>;
    let statusMock: ReturnType<typeof vi.fn>;
    let cookieMock: ReturnType<typeof vi.fn>;

    const mockUserId = new mongoose.Types.ObjectId();
    const mockUser = {
        _id: mockUserId,
        email: 'test@example.com',
        username: 'testuser',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        jsonMock = vi.fn();
        cookieMock = vi.fn();
        statusMock = vi.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {
            cookies: {
                accessToken: 'valid-access-token',
                refreshToken: 'valid-refresh-token',
            },
        };

        mockResponse = {
            status: statusMock,
            json: jsonMock,
            cookie: cookieMock,
        };

        mockNext = vi.fn();
    });

    describe('requireAuth', () => {
        it('should call next() and set req.user when tokens are valid', async () => {
            // Mock valid tokens
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: false,
                data: { user: { id: mockUserId.toString() } },
            });

            vi.mocked(verifyAccessToken).mockReturnValue({
                valid: true,
                expired: false,
                isBlank: false,
                data: { user: { id: mockUserId.toString(), email: 'test@example.com', username: 'testuser' } },
            });

            mockUserFindById.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(mockUser),
                    }),
                }),
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockRequest.user).toBeDefined();
            expect(mockRequest.user?.email).toBe('test@example.com');
        });

        it('should return 401 when refresh token is invalid', async () => {
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: false,
                expired: false,
                data: {} as any,
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Invalid token, please log in again.',
                })
            );
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when refresh token is expired', async () => {
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: true,
                data: { user: { id: mockUserId.toString() } },
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Token expired, please log in again.',
                })
            );
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 when access token is invalid (not blank)', async () => {
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: false,
                data: { user: { id: mockUserId.toString() } },
            });

            vi.mocked(verifyAccessToken).mockReturnValue({
                valid: false,
                expired: false,
                isBlank: false,
                data: {} as any,
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(401);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should refresh access token when it is blank', async () => {
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: false,
                data: { user: { id: mockUserId.toString() } },
            });

            vi.mocked(verifyAccessToken).mockReturnValue({
                valid: false,
                expired: false,
                isBlank: true,
                data: {} as any,
            });

            mockUserFindById.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(mockUser),
                    }),
                }),
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(cookieMock).toHaveBeenCalledWith(
                'accessToken',
                'new-access-token',
                expect.objectContaining({
                    maxAge: expect.any(Number),
                })
            );
            expect(mockNext).toHaveBeenCalled();
        });

        it('should refresh access token when it is expired', async () => {
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: false,
                data: { user: { id: mockUserId.toString() } },
            });

            vi.mocked(verifyAccessToken).mockReturnValue({
                valid: true,
                expired: true,
                isBlank: false,
                data: { user: { id: mockUserId.toString(), email: 'test@example.com', username: 'testuser' } },
            });

            mockUserFindById.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(mockUser),
                    }),
                }),
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(cookieMock).toHaveBeenCalledWith(
                'accessToken',
                'new-access-token',
                expect.any(Object)
            );
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 404 when user is not found in database', async () => {
            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: false,
                data: { user: { id: mockUserId.toString() } },
            });

            vi.mocked(verifyAccessToken).mockReturnValue({
                valid: true,
                expired: false,
                isBlank: false,
                data: { user: { id: mockUserId.toString(), email: 'test@example.com', username: 'testuser' } },
            });

            mockUserFindById.mockReturnValue({
                select: () => ({
                    lean: () => ({
                        exec: () => Promise.resolve(null), // User not found
                    }),
                }),
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'User not found!',
                })
            );
        });

        it('should throw error when access and refresh token user IDs mismatch', async () => {
            const differentUserId = new mongoose.Types.ObjectId().toString();

            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: true,
                expired: false,
                data: { user: { id: mockUserId.toString() } },
            });

            vi.mocked(verifyAccessToken).mockReturnValue({
                valid: true,
                expired: false,
                isBlank: false,
                data: { user: { id: differentUserId, email: 'hacker@example.com', username: 'hacker' } },
            });

            await expect(
                requireAuth(mockRequest as Request, mockResponse as Response, mockNext)
            ).rejects.toThrow('Malicious activity detected');
        });

        it('should work when cookies are missing', async () => {
            mockRequest.cookies = {};

            vi.mocked(verifyRefreshToken).mockReturnValue({
                valid: false,
                expired: false,
                data: {} as any,
            });

            await requireAuth(mockRequest as Request, mockResponse as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(401);
        });
    });
});
