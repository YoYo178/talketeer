import ENV, { NODE_ENVS } from '@src/common/env.js';
import type { CookieOptions } from 'express';

const isProd = ENV.NODE_ENV === NODE_ENVS.PRODUCTION;

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: undefined, // To be set by token type while issuing
};
