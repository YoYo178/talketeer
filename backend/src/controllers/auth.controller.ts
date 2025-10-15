import bcrypt from 'bcrypt'
import type { Request, Response, NextFunction } from "express";

import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { User } from "@src/models";
import { TEmailBody, TLoginBody, TSignUpBody, TEmailVerificationBody, TResendVerificationBody, TResetPasswordBody } from "@src/schemas";
import { cookieConfig, tokenConfig } from "@src/config";
import { generateAccessToken, generateRefreshToken, sendPasswordResetMail } from "@src/utils";
import { cleanupVerification, generateVerificationObject, getVerificationObject } from '@src/services/verification.service';
import { APIError, sendVerificationMail } from '@src/utils';
import { createUser, getUser, getUserByEmail, updateUser } from '@src/services/user.service';

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, method, data } = req.body as TEmailVerificationBody;

    const verificationObj = await getVerificationObject(userId);

    if (!verificationObj || verificationObj.purpose === 'reset-password')
        throw new APIError('Invalid or expired request', HttpStatusCodes.BAD_REQUEST);

    const user = await getUser(userId);

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

    await cleanupVerification(userId);

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

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'User verified successfully!', data: { user } })
}

export const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
    // Enforce types
    const { email } = req.body as TEmailBody;

    // Fetch the user with the given email
    const user = await getUserByEmail(email);

    // If the user does not exist, respond with a 404 Not Found
    if (!user)
        throw new APIError('No user exists with the specified email.', HttpStatusCodes.NOT_FOUND)

    if (!user.isVerified) {
        const existingObj = await getVerificationObject(user._id.toString());

        if (!existingObj) {
            const [token, code] = await generateVerificationObject(user._id.toString(), 'email-verification');
            await sendVerificationMail(user.email, user._id.toString(), code, token);
        }

        throw new APIError('User is not verified, please verify to continue', HttpStatusCodes.UNAUTHORIZED, { user: { _id: user._id.toString() } });
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

    const user = await User.findOne({ email }).lean().exec();

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

    const { passwordHash, ...rest } = user;

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

    const emailExists = !!await getUserByEmail(email);

    if (emailExists)
        throw new APIError('An account already exists with this email!', HttpStatusCodes.CONFLICT);

    const usernameExists = !!await User.findOne({ username }).select('-passwordHash').lean().exec();

    if (usernameExists)
        throw new APIError('This username is already taken, try another.', HttpStatusCodes.CONFLICT);

    const user = await createUser({ username, name, displayName, email, passwordHash: hashedPassword });

    const [token, code] = await generateVerificationObject(user._id.toString(), 'email-verification');
    await sendVerificationMail(user.email, user._id.toString(), code, token);

    res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'User successfully registered, Please verify email to continue',
        data: {
            user: {
                _id: user._id.toString()
            }
        }
    })
}

export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body as TResendVerificationBody;

    const user = await getUser(userId);

    if (!user)
        throw new APIError('User not found', HttpStatusCodes.NOT_FOUND);

    if (user.isVerified)
        throw new APIError('User is already verified', HttpStatusCodes.BAD_REQUEST);

    const [token, code] = await generateVerificationObject(userId, 'email-verification');
    await sendVerificationMail(user.email, userId, code, token);

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Resent verification email successfully' })
}

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as TEmailBody;

    const user = await getUserByEmail(email);

    if (!user)
        throw new APIError('User not found', HttpStatusCodes.NOT_FOUND);

    const existingObj = await getVerificationObject(user._id.toString());

    if (!existingObj) {
        const [token] = await generateVerificationObject(user._id.toString(), 'reset-password');
        await sendPasswordResetMail(user.email, user._id.toString(), token);
    }

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Sent password reset mail successfully' });
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, password, token } = req.body as TResetPasswordBody;

    const user = await getUser(userId);

    if (!user)
        throw new APIError('No user exists with the specified email.', HttpStatusCodes.NOT_FOUND);

    const verificationObj = await getVerificationObject(user._id.toString());

    if (!verificationObj)
        throw new APIError('Invalid or expired request', HttpStatusCodes.NOT_FOUND);

    const tokenMatches = !!await bcrypt.compare(token, verificationObj.token);

    if (!tokenMatches)
        throw new APIError('Invalid token', HttpStatusCodes.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUser(userId, { passwordHash: hashedPassword });

    await cleanupVerification(userId);

    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Password successfully reset, please login to continue' });
}