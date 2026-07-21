import type { TTokenConfig } from '@src/types/jwt.types.js';

export const DEFAULT_ACCESS_TOKEN_EXPIRY = 3 * 60 * 60 * 1000;
export const DEFAULT_REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

export const tokenConfig: TTokenConfig = {
  accessToken: {
    expiry: DEFAULT_ACCESS_TOKEN_EXPIRY, // 3 hours
  },
  refreshToken: {
    expiry: DEFAULT_REFRESH_TOKEN_EXPIRY, // 7 days
  },
};