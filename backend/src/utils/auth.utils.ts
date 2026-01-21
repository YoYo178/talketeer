import { Response } from 'express';
import { cookieConfig, tokenConfig } from '@src/config';
import { generateRefreshToken, generateAccessToken } from './jwt.utils';

/* Generates JWT tokens and issues HttpOnly cookies */
export function issueCookies(res: Response, userId: string, email: string, username: string) {
  const refreshToken = generateRefreshToken({ user: { id: userId, email } });
  const accessToken = generateAccessToken({ user: { id: userId, email, username } });

  res.cookie('accessToken', accessToken, {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken.expiry,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken.expiry,
  });
}