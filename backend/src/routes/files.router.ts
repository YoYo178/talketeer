import { Router, Request, Response, NextFunction } from "express";
import multer from 'multer'
import path from "path";
import fs from 'fs'

import { APIError } from "@src/utils/api.utils";
import HttpStatusCodes from "@src/common/HttpStatusCodes";

import { ASSETS_PATH } from "@src/config";

// Multer setup
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const userId = req.user.id;
        const uploadPath = path.join(ASSETS_PATH, 'users', userId);

        fs.mkdirSync(uploadPath, { recursive: true });

        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        callback(null, 'avatar.jpeg')
    },
})

const fileFilter: multer.Options['fileFilter'] = (req, file, callback) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true)
    } else {
        callback(new APIError('Only JPEG, PNG, and WEBP images are allowed!', HttpStatusCodes.BAD_REQUEST));
    }
}

const limits: multer.Options['limits'] = {
    fileSize: 2 * 1024 * 1024 // 2MB
}

const upload = multer({ storage, fileFilter, limits })

const FilesRouter = Router();

FilesRouter.post('/avatar', upload.single('avatar'), (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'Updated avatar successfully!' })
})

export default FilesRouter;