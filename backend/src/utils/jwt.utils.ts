import ENV from '@src/common/ENV'
import { tokenConfig } from '@src/config';
import { TAccessTokenPayload, TDecodedToken, TRefreshTokenPayload } from '@src/types';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

export function generateAccessToken(data: TAccessTokenPayload): string {
    const accessToken = jwt.sign(
        data,
        ENV.AccessTokenSecret,
        { expiresIn: tokenConfig.accessToken.expiry / 1000 } // Note: JWT takes expiry time in seconds, not milliseconds.
    );

    return accessToken;
}

export function generateRefreshToken(data: TRefreshTokenPayload): string {
    const refreshToken = jwt.sign(
        data,
        ENV.RefreshTokenSecret,
        { expiresIn: tokenConfig.refreshToken.expiry / 1000 } // Note: JWT takes expiry time in seconds, not milliseconds.
    );

    return refreshToken;
}

export function verifyAccessToken(token: string): TDecodedToken<TAccessTokenPayload> {
    try {
        const decoded = jwt.verify(token, ENV.AccessTokenSecret) as TAccessTokenPayload;
        return { valid: true, expired: false, data: decoded };
    } catch (err) {
        const error = err as JsonWebTokenError;
        console.error('An error occured while verifying access token!\nError details:', error.message || '')

        if (err instanceof TokenExpiredError)
            return { valid: true, expired: true, data: {} as TAccessTokenPayload };

        return { valid: false, expired: true, data: {} as TAccessTokenPayload };
    }
}

export function verifyRefreshToken(token: string): TDecodedToken<TRefreshTokenPayload> {
    try {
        const decoded = jwt.verify(token, ENV.RefreshTokenSecret) as TRefreshTokenPayload;
        return { valid: true, expired: false, data: decoded };
    } catch (err) {
        const error = err as JsonWebTokenError;
        console.error('An error occured while verifying refresh token!\nError details:', error.message || '')

        if (err instanceof TokenExpiredError)
            return { valid: true, expired: true, data: {} as TAccessTokenPayload };

        return { valid: false, expired: false, data: {} as TRefreshTokenPayload };
    }
}