import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from '@src/utils/jwt.utils';

// Mock the ENV module
vi.mock('@src/common/ENV', () => ({
    default: {
        AccessTokenSecret: 'test-access-token-secret-key-12345',
        RefreshTokenSecret: 'test-refresh-token-secret-key-12345',
    },
}));

// Mock the tokenConfig
vi.mock('@src/config', () => ({
    tokenConfig: {
        accessToken: {
            expiry: 15 * 60 * 1000, // 15 minutes in ms
        },
        refreshToken: {
            expiry: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        },
    },
}));

describe('JWT Utils', () => {
    const mockAccessTokenPayload = {
        user: {
            id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            username: 'testuser',
        },
    };

    const mockRefreshTokenPayload = {
        user: {
            id: '507f1f77bcf86cd799439011',
        },
    };

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const token = generateAccessToken(mockAccessTokenPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        it('should generate a token that can be decoded', () => {
            const token = generateAccessToken(mockAccessTokenPayload);
            const decoded = jwt.decode(token) as Record<string, unknown>;

            expect(decoded).toBeDefined();
            expect(decoded.user).toBeDefined();
            expect((decoded.user as Record<string, unknown>).email).toBe('test@example.com');
        });

        it('should include expiration in the token', () => {
            const token = generateAccessToken(mockAccessTokenPayload);
            const decoded = jwt.decode(token) as Record<string, unknown>;

            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
        });

        it('should generate unique tokens for different payloads', () => {
            const token1 = generateAccessToken(mockAccessTokenPayload);
            const token2 = generateAccessToken({
                user: { id: 'different-id', email: 'other@example.com', username: 'other' },
            });

            expect(token1).not.toBe(token2);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = generateRefreshToken(mockRefreshTokenPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        it('should generate a token that can be decoded', () => {
            const token = generateRefreshToken(mockRefreshTokenPayload);
            const decoded = jwt.decode(token) as Record<string, unknown>;

            expect(decoded).toBeDefined();
            expect(decoded.user).toBeDefined();
            expect((decoded.user as Record<string, unknown>).id).toBe('507f1f77bcf86cd799439011');
        });

        it('should include expiration in the token', () => {
            const token = generateRefreshToken(mockRefreshTokenPayload);
            const decoded = jwt.decode(token) as Record<string, unknown>;

            expect(decoded.exp).toBeDefined();
            expect(decoded.iat).toBeDefined();
        });
    });

    describe('verifyAccessToken', () => {
        it('should return valid result for a valid token', () => {
            const token = generateAccessToken(mockAccessTokenPayload);
            const result = verifyAccessToken(token);

            expect(result.valid).toBe(true);
            expect(result.expired).toBe(false);
            expect(result.isBlank).toBe(false);
            expect(result.data.user.email).toBe('test@example.com');
        });

        it('should return isBlank true for undefined token', () => {
            const result = verifyAccessToken(undefined);

            expect(result.valid).toBe(false);
            expect(result.expired).toBe(false);
            expect(result.isBlank).toBe(true);
        });

        it('should return isBlank true for empty string token', () => {
            const result = verifyAccessToken('');

            expect(result.valid).toBe(false);
            expect(result.expired).toBe(false);
            expect(result.isBlank).toBe(true);
        });

        it('should return invalid for malformed token', () => {
            const result = verifyAccessToken('invalid.token.here');

            expect(result.valid).toBe(false);
        });

        it('should return invalid for token signed with wrong secret', () => {
            const wrongToken = jwt.sign(mockAccessTokenPayload, 'wrong-secret', { expiresIn: '15m' });
            const result = verifyAccessToken(wrongToken);

            expect(result.valid).toBe(false);
        });

        it('should return expired true for expired token', () => {
            // Create an already expired token
            const expiredToken = jwt.sign(
                mockAccessTokenPayload,
                'test-access-token-secret-key-12345',
                { expiresIn: '-1s' }
            );
            const result = verifyAccessToken(expiredToken);

            expect(result.valid).toBe(true);
            expect(result.expired).toBe(true);
        });
    });

    describe('verifyRefreshToken', () => {
        it('should return valid result for a valid token', () => {
            const token = generateRefreshToken(mockRefreshTokenPayload);
            const result = verifyRefreshToken(token);

            expect(result.valid).toBe(true);
            expect(result.expired).toBe(false);
            expect(result.data.user.id).toBe('507f1f77bcf86cd799439011');
        });

        it('should return invalid for empty string', () => {
            const result = verifyRefreshToken('');

            expect(result.valid).toBe(false);
        });

        it('should return invalid for malformed token', () => {
            const result = verifyRefreshToken('not-a-valid-jwt');

            expect(result.valid).toBe(false);
        });

        it('should return invalid for token signed with wrong secret', () => {
            const wrongToken = jwt.sign(mockRefreshTokenPayload, 'wrong-secret', { expiresIn: '7d' });
            const result = verifyRefreshToken(wrongToken);

            expect(result.valid).toBe(false);
        });

        it('should return expired true for expired token', () => {
            const expiredToken = jwt.sign(
                mockRefreshTokenPayload,
                'test-refresh-token-secret-key-12345',
                { expiresIn: '-1s' }
            );
            const result = verifyRefreshToken(expiredToken);

            expect(result.valid).toBe(true);
            expect(result.expired).toBe(true);
        });
    });

    describe('token interoperability', () => {
        it('should not validate access token as refresh token', () => {
            const accessToken = generateAccessToken(mockAccessTokenPayload);
            const result = verifyRefreshToken(accessToken);

            // Different secrets, so should be invalid
            expect(result.valid).toBe(false);
        });

        it('should not validate refresh token as access token', () => {
            const refreshToken = generateRefreshToken(mockRefreshTokenPayload);
            const result = verifyAccessToken(refreshToken);

            // Different secrets, so should be invalid
            expect(result.valid).toBe(false);
        });
    });
});
