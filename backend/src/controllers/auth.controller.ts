import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';

import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';

import { cookieConfig } from '@src/config/cookies.config.js';
import {
  DEFAULT_ACCESS_TOKEN_EXPIRY,
  DEFAULT_REFRESH_TOKEN_EXPIRY,
  tokenConfig,
} from '@src/config/jwt.config.js';
import { User } from '@src/models/user.model.js';
import type {
  TEmailBody,
  TEmailVerificationBody,
  TLoginBody,
  TResendVerificationBody,
  TResetPasswordBody,
  TSignUpBody,
} from '@src/schemas/auth.schema.js';
import { createUser, getUser, getUserByEmail, updateUser } from '@src/services/user.service.js';
import {
  cleanupVerification,
  generateVerificationObject,
  getVerificationObject,
} from '@src/services/verification.service.js';
import { APIError } from '@src/utils/api.utils.js';
import { generateAccessToken, generateRefreshToken } from '@src/utils/jwt.utils.js';
import {
  sendPasswordResetMail,
  sendVerificationMail,
  validateEmailMx,
} from '@src/utils/mail.utils.js';
import { handleHashMigration } from '@src/utils/auth.utils.js';

export const verifyEmail = async (req: Request, res: Response) => {
  const { userId, method, data } = req.body as TEmailVerificationBody;

  const verificationObj = await getVerificationObject(userId);

  if (!verificationObj || verificationObj.purpose === 'reset-password')
    throw new APIError('Invalid or expired request', HTTP_STATUS_CODES.BadRequest);

  const user = await getUser(userId);

  if (!user) throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  if (user.isVerified) throw new APIError('User is already verified', HTTP_STATUS_CODES.Forbidden);

  switch (method) {
    case 'code':
      if (data !== verificationObj.code)
        throw new APIError('Invalid code', HTTP_STATUS_CODES.BadRequest);

      await updateUser(user._id.toString(), {
        isVerified: true,
        verifiedAt: new Date(Date.now()),
      });
      break;
    case 'token':
      if (!(await argon2.verify(verificationObj.token, data)))
        throw new APIError(
          'Invalid token, make sure the link is correct!',
          HTTP_STATUS_CODES.BadRequest,
        );

      await updateUser(user._id.toString(), {
        isVerified: true,
        verifiedAt: new Date(Date.now()),
      });
      break;
    default:
      throw new APIError('Unknown method', HTTP_STATUS_CODES.BadRequest);
  }

  await cleanupVerification(userId);

  const refreshToken = generateRefreshToken({
    user: { id: user._id.toString(), email: user.email },
  });
  const accessToken = generateAccessToken({
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
  });

  res.cookie('accessToken', accessToken, {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken?.expiry ?? DEFAULT_ACCESS_TOKEN_EXPIRY,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken?.expiry ?? DEFAULT_REFRESH_TOKEN_EXPIRY,
  });

  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'User verified successfully!',
    data: { user },
  });
};

export const checkEmail = async (req: Request, res: Response) => {
  // Enforce types
  const { email } = req.body as TEmailBody;

  await validateEmailMx(email);

  // Fetch the user with the given email
  const user = await getUserByEmail(email);

  // If the user does not exist, respond with a 404 Not Found
  if (!user)
    throw new APIError('No user exists with the specified email.', HTTP_STATUS_CODES.NotFound);

  if (!user.isVerified) {
    const existingObj = await getVerificationObject(user._id.toString());

    if (!existingObj) {
      const [token = '', code = ''] = await generateVerificationObject(
        user._id.toString(),
        'email-verification',
      );
      await sendVerificationMail(user.email, user._id.toString(), code, token);
    }

    throw new APIError(
      'User is not verified, please verify to continue',
      HTTP_STATUS_CODES.Unauthorized,
      { user: { _id: user._id.toString() } },
    );
  }

  // If the user does exist, respond with a 200 OK
  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'User exists',
    data: {
      user: { email },
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as TLoginBody;

  const user = await User.findOne({ email }).lean().exec();

  if (!user)
    throw new APIError('No user exists with the specified email.', HTTP_STATUS_CODES.NotFound);

  if (!user.isVerified)
    throw new APIError(
      'User is not verified, please verify to continue',
      HTTP_STATUS_CODES.Unauthorized,
    );

  const passwordMatches = user.hasLegacyHashing
    ? await bcrypt.compare(password, user.passwordHash)
    : await argon2.verify(user.passwordHash, password);

  if (user.hasLegacyHashing) await handleHashMigration(user._id?.toString?.() ?? '', password);

  if (!passwordMatches) throw new APIError('Invalid password', HTTP_STATUS_CODES.BadRequest);

  const refreshToken = generateRefreshToken({
    user: { id: user._id.toString(), email: user.email },
  });
  const accessToken = generateAccessToken({
    user: {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
    },
  });

  res.cookie('accessToken', accessToken, {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken?.expiry ?? DEFAULT_ACCESS_TOKEN_EXPIRY,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken?.expiry ?? DEFAULT_REFRESH_TOKEN_EXPIRY,
  });

  // the pain to exclude a SINGLE field from an object while keeping both typescript and eslint happy...
  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'Logged in successfully!',
    data: {
      user: {
        _id: user._id.toString(),
        name: user.name,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatarURL: user.avatarURL,
        notifications: user.notifications,
        friends: user.friends,
        room: user.room,
        isVerified: user.isVerified,
        verifiedAt: user.verifiedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie('accessToken', {
    ...cookieConfig,
    maxAge: tokenConfig.accessToken?.expiry ?? DEFAULT_ACCESS_TOKEN_EXPIRY,
  });

  res.clearCookie('refreshToken', {
    ...cookieConfig,
    maxAge: tokenConfig.refreshToken?.expiry ?? DEFAULT_REFRESH_TOKEN_EXPIRY,
  });

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, message: 'Logged out successfully!' });
};

export const signup = async (req: Request, res: Response) => {
  const { username, name, displayName, email, password } = req.body as TSignUpBody;

  const hashedPassword = await argon2.hash(password);

  const emailExists = !!(await getUserByEmail(email));

  if (emailExists)
    throw new APIError('An account already exists with this email!', HTTP_STATUS_CODES.Conflict);

  const usernameExists = !!(await User.findOne({ username }).select('-passwordHash').lean().exec());

  if (usernameExists)
    throw new APIError('This username is already taken, try another.', HTTP_STATUS_CODES.Conflict);

  const user = await createUser({
    username,
    name,
    displayName,
    email,
    passwordHash: hashedPassword,
  });

  const [token = '', code = ''] = await generateVerificationObject(
    user._id.toString(),
    'email-verification',
  );
  await sendVerificationMail(user.email, user._id.toString(), code, token);

  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'User successfully registered, Please verify email to continue',
    data: {
      user: {
        _id: user._id.toString(),
      },
    },
  });
};

export const resendVerification = async (req: Request, res: Response) => {
  const { userId } = req.body as TResendVerificationBody;

  const user = await getUser(userId);

  if (!user) throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  if (user.isVerified) throw new APIError('User is already verified', HTTP_STATUS_CODES.BadRequest);

  const [token = '', code = ''] = await generateVerificationObject(userId, 'email-verification');
  await sendVerificationMail(user.email, userId, code, token);

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json({ success: true, message: 'Resent verification email successfully' });
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body as TEmailBody;

  const user = await getUserByEmail(email);

  if (!user) throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  const existingObj = await getVerificationObject(user._id.toString());

  if (!existingObj) {
    const [token = ''] = await generateVerificationObject(user._id.toString(), 'reset-password');
    await sendPasswordResetMail(user.email, user._id.toString(), token);
  }

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json({ success: true, message: 'Sent password reset mail successfully' });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { userId, password, token } = req.body as TResetPasswordBody;

  const user = await getUser(userId);

  if (!user)
    throw new APIError('No user exists with the specified email.', HTTP_STATUS_CODES.NotFound);

  const verificationObj = await getVerificationObject(user._id.toString());

  if (!verificationObj)
    throw new APIError('Invalid or expired request', HTTP_STATUS_CODES.NotFound);

  const tokenMatches = await argon2.verify(verificationObj.token, token);

  if (!tokenMatches) throw new APIError('Invalid token', HTTP_STATUS_CODES.BadRequest);

  const hashedPassword = await argon2.hash(password);
  await updateUser(userId, { passwordHash: hashedPassword });

  await cleanupVerification(userId);

  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    message: 'Password successfully reset, please login to continue',
  });
};
