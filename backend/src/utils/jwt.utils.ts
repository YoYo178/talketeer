import ENV from '@src/common/env.js';
import { DEFAULT_ACCESS_TOKEN_EXPIRY, DEFAULT_REFRESH_TOKEN_EXPIRY, tokenConfig } from '@src/config/jwt.config.js';
import type { TAccessTokenPayload, TDecodedToken, TRefreshTokenPayload } from '@src/types/jwt.types.js';
import jwt from 'jsonwebtoken';
import logger from './logger.utils.js';

export function generateAccessToken(data: TAccessTokenPayload): string {
  const accessToken = jwt.sign(
    data,
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: (tokenConfig.accessToken?.expiry ?? DEFAULT_ACCESS_TOKEN_EXPIRY) / 1000 }, // Note: JWT takes expiry time in seconds, not milliseconds.
  );

  return accessToken;
}

export function generateRefreshToken(data: TRefreshTokenPayload): string {
  const refreshToken = jwt.sign(
    data,
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: (tokenConfig.refreshToken?.expiry ?? DEFAULT_REFRESH_TOKEN_EXPIRY) / 1000 }, // Note: JWT takes expiry time in seconds, not milliseconds.
  );

  return refreshToken;
}

export function verifyAccessToken(token: string | undefined): TDecodedToken<TAccessTokenPayload> & { isBlank: boolean } {
  if (!token?.length)
    return { valid: false, expired: false, isBlank: true, data: {} as TAccessTokenPayload };

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET) as TAccessTokenPayload;
    return { valid: true, expired: false, isBlank: false, data: decoded };
  } catch (err) {
    const error = err as jwt.JsonWebTokenError;
    logger.error('Error verifying access token', {
      error: error.message || 'Unknown error',
      stack: error.stack,
    });

    if (err instanceof jwt.TokenExpiredError)
      return { valid: true, expired: true, isBlank: false, data: {} as TAccessTokenPayload };

    return { valid: false, expired: true, isBlank: false, data: {} as TAccessTokenPayload };
  }
}

export function verifyRefreshToken(token: string): TDecodedToken<TRefreshTokenPayload> {
  try {
    const decoded = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as TRefreshTokenPayload;
    return { valid: true, expired: false, data: decoded };
  } catch (err) {
    const error = err as jwt.JsonWebTokenError;
    logger.error('Error verifying refresh token', {
      error: error.message || 'Unknown error',
      stack: error.stack,
    });

    if (err instanceof jwt.TokenExpiredError)
      return { valid: true, expired: true, data: {} as TAccessTokenPayload };

    return { valid: false, expired: false, data: {} as TRefreshTokenPayload };
  }
}