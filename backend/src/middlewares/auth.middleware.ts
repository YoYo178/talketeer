import type { ExtendedError } from "socket.io";
import type { Request, Response, NextFunction } from "express"
import * as cookie from 'cookie';

import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { cookieConfig, tokenConfig } from "@src/config";
import { User } from "@src/models";
import { TalketeerSocket, TVerifyAuthReturn } from "@src/types";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@src/utils";

const verifyAuth = async (refreshToken?: string, accessToken?: string): Promise<TVerifyAuthReturn> => {
    const returnObj: TVerifyAuthReturn = { success: false, isMaliciousUser: false, data: { user: null } };

    // Verify refresh token
    const decodedRefreshToken = verifyRefreshToken(refreshToken || '');

    // Invalid refresh token, prompt the user to log in again
    if (!decodedRefreshToken.valid) {
        returnObj.error = {
            message: 'Invalid token, please log in again.',
            code: HttpStatusCodes.UNAUTHORIZED
        }
        return returnObj;
    }

    // Expired refresh token, prompt the user to log in again
    if (decodedRefreshToken.expired) {
        returnObj.error = {
            message: 'Token expired, please log in again.',
            code: HttpStatusCodes.UNAUTHORIZED
        }
        return returnObj;
    }

    // Verify access token
    const decodedAccessToken = verifyAccessToken(accessToken || '');

    // Invalid access token, prompt the user to log in again even if the refresh token is valid
    // as this can be a sign of maliciousness
    if (!decodedAccessToken.valid) {
        returnObj.error = {
            message: 'Invalid token, please log in again.',
            code: HttpStatusCodes.UNAUTHORIZED
        }
        return returnObj;
    }

    // Access token and Refresh token mismatch, malicious user spotted
    // Add the user to blacklist
    const isMaliciousUser = decodedRefreshToken.data.user.id !== decodedAccessToken.data.user.id;
    if (isMaliciousUser) {
        returnObj.isMaliciousUser = true;
        return returnObj;
    }

    // Fetch the user via ID from database, and exclude password because we ain't need any of that
    const user = await User.findById(decodedRefreshToken.data.user.id).select('-passwordHash').lean().exec();

    // User not found, maybe user deleted their account but the tokens are still stored?
    if (!user) {
        returnObj.error = {
            message: 'User not found!',
            code: HttpStatusCodes.NOT_FOUND
        };
        return returnObj;
    }

    // Silent access token refresh (yes checking this late is intentional)
    if (decodedAccessToken.expired)
        returnObj.data.accessToken = generateAccessToken({ user: { id: user._id.toString(), email: user.email, username: user.username } });

    // Update object state and finally return, as shrimple as that
    returnObj.success = true;
    returnObj.data.user = user;

    return returnObj;
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    const authDetails = await verifyAuth(refreshToken, accessToken);

    if (!authDetails.success && authDetails.error) {
        res.status(authDetails.error.code).json({ success: false, error: authDetails.error.message });
        return;
    }

    if (authDetails.isMaliciousUser) {
        // TODO: Blacklist by IP
        res.status(HttpStatusCodes.FORBIDDEN).json({ success: false, error: 'Malicious activity detected, you have been added to the blacklist.' });
        return;
    }

    // Handle silent access token refresh
    if (authDetails.data.accessToken)
        res.cookie('accessToken', authDetails.data.accessToken, { ...cookieConfig, maxAge: tokenConfig.accessToken.expiry })

    if (authDetails.data.user) {
        const user = authDetails.data.user;

        req.user = {
            id: user._id.toString(),
            email: user.email,
            username: user.username
        }

        next();
        return;
    }

    next(new Error('Something went wrong.'))
}

export const requireSocketAuth = async (socket: TalketeerSocket, next: (err?: ExtendedError) => void) => {
    const rawCookie = socket.handshake.headers.cookie;
    if (!rawCookie) return next(new Error('Unauthorized'));

    const cookies = cookie.parse(rawCookie);
    const { accessToken, refreshToken } = cookies;

    const authDetails = await verifyAuth(refreshToken, accessToken);

    if (authDetails.isMaliciousUser) {
        // TODO: Blacklist by IP
        next(new Error('Malicious activity detected, you have been added to the blacklist.'));
        return;
    }

    if (authDetails.data.user) {
        socket.data.user = {
            id: authDetails.data.user._id.toString(),
            email: authDetails.data.user.email,
            username: authDetails.data.user.username
        }

        next();
        return;
    }

    next(new Error('Something went wrong.'));
}