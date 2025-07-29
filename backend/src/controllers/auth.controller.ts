import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { User } from "@src/models/user.model";
import { TSignUpBody } from "@src/schemas";
import type { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt'

export const login = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'login: TODO!' });
}

export const logout = (req: Request, res: Response, next: NextFunction) => {
    res.status(HttpStatusCodes.OK).json({ success: true, message: 'logout: TODO!' })
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