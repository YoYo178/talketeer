import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import { User } from '@src/models/user.model.js';
import type { TUpdateMeBody, TUserIdParams } from '@src/schemas/users.schema.js';
import { APIError } from '@src/utils/api.utils.js';
import type { Request, Response } from 'express';

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user.id).select('-passwordHash -hasLegacyHashing').lean().exec();

  if (!user) throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { user } });
};

export const updateMe = async (req: Request, res: Response) => {
  const { bio, displayName, name } = req.body as TUpdateMeBody;

  const user = await User.findById(req.user.id).select('-passwordHash -hasLegacyHashing').exec();

  if (!user) throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  user.name = name ?? user.name;
  user.displayName = displayName ?? user.displayName;
  user.bio = bio ?? user.bio;

  await user.save();

  req.io.emit('userUpdated', req.user.id);

  res
    .status(HTTP_STATUS_CODES.Ok)
    .json({ success: true, message: 'Updated user successfully', data: { user } });
};

export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params as TUserIdParams;
  const user = await User.findById(userId)
    .select(
      `
            -passwordHash
            -hasLegacyHashing
            -name
            -email
            -friends
            -notifications
            -room
            -updatedAt
            -isVerified
            -verifiedAt
        `,
    )
    .lean()
    .exec();

  if (!user) throw new APIError('User not found', HTTP_STATUS_CODES.NotFound);

  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, data: { user } });
};
