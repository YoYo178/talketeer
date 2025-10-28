import mongoose from 'mongoose';

export interface IVerification {
    userId: mongoose.Types.ObjectId;
    purpose: 'email-verification' | 'reset-password';
    token: string;
    code: string;

    createdAt?: Date;
}