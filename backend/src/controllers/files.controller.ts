import { Request, Response } from 'express';
import { APIError } from '@src/utils';
import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';

export const uploadAvatar = (_req: Request, res: Response) => {
  res.status(HTTP_STATUS_CODES.Ok).json({ 
    success: true, 
    message: 'Updated avatar successfully!',
  });
};

export const uploadAttachment = (req: Request, res: Response) => {
  if (!req.file) {
    throw new APIError('No file uploaded or file type not allowed', HTTP_STATUS_CODES.BadRequest);
  }
  const fileUrl = `/assets/attachments/${req.file.filename}`;

  res.status(HTTP_STATUS_CODES.Ok).json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    },
  });
};