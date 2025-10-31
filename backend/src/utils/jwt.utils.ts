import ENV from '@src/common/ENV';
import { tokenConfig } from '@src/config';
import { TAccessTokenPayload, TDecodedToken, TRefreshTokenPayload } from '@src/types';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import logger from './logger.utils';

export function generateAccessToken(data: TAccessTokenPayload): string {
  const accessToken = jwt.sign(
    data,
    ENV.AccessTokenSecret,
    { expiresIn: tokenConfig.accessToken.expiry / 1000 }, // Note: JWT takes expiry time in seconds, not milliseconds.
  );

  return accessToken;
}

export function generateRefreshToken(data: TRefreshTokenPayload): string {
  const refreshToken = jwt.sign(
    data,
    ENV.RefreshTokenSecret,
    { expiresIn: tokenConfig.refreshToken.expiry / 1000 }, // Note: JWT takes expiry time in seconds, not milliseconds.
  );

  return refreshToken;
}

export function verifyAccessToken(token: string | undefined): TDecodedToken<TAccessTokenPayload> & { isBlank: boolean } {
  if (!token?.length)
    return { valid: false, expired: false, isBlank: true, data: {} as TAccessTokenPayload };

  try {
    const decoded = jwt.verify(token, ENV.AccessTokenSecret) as TAccessTokenPayload;
    return { valid: true, expired: false, isBlank: false, data: decoded };
  } catch (err) {
    const error = err as JsonWebTokenError;
    logger.error('Error verifying access token', {
      error: error.message || 'Unknown error',
      stack: error.stack,
    });

    if (err instanceof TokenExpiredError)
      return { valid: true, expired: true, isBlank: false, data: {} as TAccessTokenPayload };

    return { valid: false, expired: true, isBlank: false, data: {} as TAccessTokenPayload };
  }
}

export function verifyRefreshToken(token: string): TDecodedToken<TRefreshTokenPayload> {
  try {
    const decoded = jwt.verify(token, ENV.RefreshTokenSecret) as TRefreshTokenPayload;
    return { valid: true, expired: false, data: decoded };
  } catch (err) {
    const error = err as JsonWebTokenError;
    logger.error('Error verifying refresh token', {
      error: error.message || 'Unknown error',
      stack: error.stack,
    });

    if (err instanceof TokenExpiredError)
      return { valid: true, expired: true, data: {} as TAccessTokenPayload };

    return { valid: false, expired: false, data: {} as TRefreshTokenPayload };
  }
}