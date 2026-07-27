import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { APIError } from '@src/utils/api.utils.js';
import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';

import { ASSETS_PATH } from '@src/config/files.config.js';

// Multer setup
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
  destination: (req, _file, callback) => {
    const userId = req.user.id;
    const uploadPath = path.join(ASSETS_PATH, 'users', userId);

    fs.mkdirSync(uploadPath, { recursive: true });

    callback(null, uploadPath);
  },
  filename: (_req, _file, callback) => {
    callback(null, 'avatar.jpeg');
  },
});

const fileFilter: multer.Options['fileFilter'] = (_, file, callback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new APIError('Only JPEG, PNG, and WEBP images are allowed!', HTTP_STATUS_CODES.BadRequest),
    );
  }
};

const limits: multer.Options['limits'] = {
  fileSize: 2 * 1024 * 1024, // 2MB
};

const upload = multer({ storage, fileFilter, limits });

const FilesRouter = Router();

FilesRouter.post('/avatar', upload.single('avatar'), (_: Request, res: Response) => {
  res.status(HTTP_STATUS_CODES.Ok).json({ success: true, message: 'Updated avatar successfully!' });
});

export default FilesRouter;
