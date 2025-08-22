import bcrypt from 'bcrypt'
import type { Request, Response, NextFunction } from "express";

import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { User } from "@src/models";
import { TCheckEmailBody, TLoginBody, TSignUpBody } from "@src/schemas";
import { cookieConfig, tokenConfig } from "@src/config";
import { generateAccessToken, generateRefreshToken } from "@src/utils";

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    // Enforce types
    const { email } = req.body as TCheckEmailBody;

    // Fetch the user with the given email
    const user = await User.findOne({ email }).select('-password').lean().exec();

    // If the user does not exist, respond with a 404 Not Found
    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: 'No user exists with the specified email.' });
        return;
    }

    // If the user does exist, respond with a 200 OK
    res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'User exists',
        data: {
            user: { email }
        }
    });
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as TLoginBody;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: 'No user exists with the specified email.' });
        return;
    }

    const passwordMatches = !!await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false, message: 'Invalid password!' });
        return;
    }

    const refreshToken = generateRefreshToken({ user: { id: user._id.toString(), email: user.email } });
    const accessToken = generateAccessToken({ user: { id: user._id.toString(), email: user.email, username: user.username } });

    res.cookie('accessToken', accessToken, {
        ...cookieConfig,
        maxAge: tokenConfig.accessToken.expiry
    });

    res.cookie('refreshToken', refreshToken, {
        ...cookieConfig,
        maxAge: tokenConfig.refreshToken.expiry
    });

    const { passwordHash, ...rest } = user.toObject();

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Logged in successfully!', data: { user: rest } });
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        ...cookieConfig,
        maxAge: tokenConfig.accessToken.expiry
    });

    res.clearCookie('refreshToken', {
        ...cookieConfig,
        maxAge: tokenConfig.refreshToken.expiry
    });

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Logged out successfully!' })
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { username, name, displayName, email, password } = req.body as TSignUpBody;

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailExists = !!await User.findOne({ email }).select('-passwordHash').lean();

    if (emailExists) {
        res.status(HttpStatusCodes.CONFLICT).json({ success: false, message: 'An account already exists with this email!' });
        return;
    }

    const usernameExists = !!await User.findOne({ username }).select('-passwordHash').lean();

    if (usernameExists) {
        res.status(HttpStatusCodes.CONFLICT).json({ success: false, message: 'This username is already taken, try another.' });
        return;
    }

    const user = await User.create({ username, name, displayName, email, passwordHash: hashedPassword });
    const { passwordHash, ...rest } = user.toObject();

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Created user successfully!', data: { user: rest } })
}