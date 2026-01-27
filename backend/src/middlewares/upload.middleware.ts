import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { APIError } from '@src/utils';
import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';
import { ASSETS_PATH } from '@src/config';

const avatarStorage = multer.diskStorage({
  destination: (req, _file, callback) => {
    // @ts-ignore
    const userId = req.user.id;
    const uploadPath = path.join(ASSETS_PATH, 'users', userId);
    fs.mkdirSync(uploadPath, { recursive: true });
    callback(null, uploadPath);
  },
  filename: (_req, _file, callback) => {
    callback(null, 'avatar.jpeg');
  },
});

export const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new APIError('Only JPEG, PNG, and WEBP images are allowed!', HTTP_STATUS_CODES.BadRequest));
    }
  }
});

const attachmentStorage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    const uploadPath = path.join(ASSETS_PATH, 'attachments');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    callback(null, uploadPath);
  },
  // filename: (_req, file, callback) => {
  //   const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/\s+/g, '_')}`;
  //   callback(null, uniqueName);
  // },
});

export const attachmentUpload = multer({ 
  storage: attachmentStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf', 
      'text/plain', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip', 
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'video/mp4', 'video/webm',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new APIError('Invalid file type. Allowed: Images, Video, Audio, Docs, Zips.', HTTP_STATUS_CODES.BadRequest));
    }
  }
});