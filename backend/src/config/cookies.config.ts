import { NodeEnvs } from '@src/common/constants';
import ENV from '@src/common/ENV';
import { CookieOptions } from 'express';

const isProd = ENV.NodeEnv === NodeEnvs.Production;

export const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  maxAge: undefined, // To be set by token type while issuing
};