import { Router } from 'express';
import { uploadAvatar, uploadAttachment } from '@src/controllers/files.controller';
import { avatarUpload, attachmentUpload } from '@src/middlewares/upload.middleware';

const FilesRouter = Router();

// Route: POST /api/files/avatar
FilesRouter.post('/avatar', avatarUpload.single('avatar'), uploadAvatar);

// Route: POST /api/files/upload
FilesRouter.post('/upload', attachmentUpload.single('file'), uploadAttachment);

export default FilesRouter;