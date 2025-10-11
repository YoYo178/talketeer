import bcrypt from 'bcrypt'
import type { Request, Response, NextFunction } from "express";

import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { User } from "@src/models";
import { TCheckEmailBody, TLoginBody, TSignUpBody } from "@src/schemas";
import { cookieConfig, tokenConfig } from "@src/config";
import { generateAccessToken, generateRefreshToken } from "@src/utils";
import { APIError } from '@src/utils/api.utils';
import { generateVerificationObject, getVerificationObject } from '@src/services/verification.service';
import { sendVerificationMail } from '@src/utils/mail.utils';
import { TEmailVerificationBody } from '@src/schemas/verification.schema';
import { getPublicUser, getUserByEmail, updateUser } from '@src/services/user.service';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email, method, data } = req.body as TEmailVerificationBody;

    const verificationObj = await getVerificationObject(email);

    if (!verificationObj || verificationObj.purpose === 'reset-password')
        throw new APIError('Invalid or expired request', HttpStatusCodes.BAD_REQUEST);

    const user = await getUserByEmail(email);

    if (!user)
        throw new APIError('User not found', HttpStatusCodes.NOT_FOUND);

    if (user.isVerified)
        throw new APIError('User is already verified', HttpStatusCodes.FORBIDDEN);

    switch (method) {
        case 'code':
            if (data !== verificationObj.code)
                throw new APIError('Invalid code', HttpStatusCodes.BAD_REQUEST);

            await updateUser(user._id.toString(), { isVerified: true, verifiedAt: new Date(Date.now()) });
            break;
        case 'token':
            const doesMatch = await bcrypt.compare(data, verificationObj.token);

            if (!doesMatch)
                throw new APIError('Invalid token, make sure the link is correct!', HttpStatusCodes.BAD_REQUEST);

            await updateUser(user._id.toString(), { isVerified: true, verifiedAt: new Date(Date.now()) });
            break;
        default:
            throw new APIError('Unknown method', HttpStatusCodes.BAD_REQUEST);
    }

    // TODO: Issue tokens to user so the user doesn't need to login again after the entire process

    res.status(HttpStatusCodes.OK).json({ message: 'User verified successfully!', data: { user: getPublicUser(user) } })
}

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    // Enforce types
    const { email } = req.body as TCheckEmailBody;

    // Fetch the user with the given email
    const user = await User.findOne({ email }).select('-password').lean().exec();

    // If the user does not exist, respond with a 404 Not Found
    if (!user)
        throw new APIError('No user exists with the specified email.', HttpStatusCodes.NOT_FOUND)

    if (!user.isVerified)
        throw new APIError('User is not verified, please verify to continue', HttpStatusCodes.UNAUTHORIZED)

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

    if (!user)
        throw new APIError('No user exists with the specified email.', HttpStatusCodes.NOT_FOUND);

    if (!user.isVerified)
        throw new APIError('User is not verified, please verify to continue', HttpStatusCodes.UNAUTHORIZED)

    const passwordMatches = !!await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches)
        throw new APIError('Invalid password', HttpStatusCodes.BAD_REQUEST);

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

    if (emailExists)
        throw new APIError('An account already exists with this email!', HttpStatusCodes.CONFLICT);

    const usernameExists = !!await User.findOne({ username }).select('-passwordHash').lean();

    if (usernameExists)
        throw new APIError('This username is already taken, try another.', HttpStatusCodes.CONFLICT);

    const user = await User.create({ username, name, displayName, email, passwordHash: hashedPassword });
    const { passwordHash, ...rest } = user.toObject();

    const [token, code] = await generateVerificationObject(email, 'email-verification');

    await sendVerificationMail(email, code, token);

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'User successfully registered, Please verify email to continue', data: { user: rest } })
}