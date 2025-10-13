import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Verification } from "@src/models";
import { IVerification } from '@src/types';

export async function getVerificationObject(userId: string) {
    return Verification.findOne({ userId }).lean().exec();
}

export async function generateVerificationObject(userId: string, purpose: IVerification['purpose']) {
    await cleanupVerification(userId);

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);
    const code = Math.floor(Math.random() * 900000).toString().padStart(6, '0');

    const verificationObj = await Verification.create({
        userId,
        token: hashedToken,
        code,
        purpose
    })

    return [token, verificationObj.code]
}

async function cleanupVerification(userId: string) {
    await Verification.deleteMany({ userId })
}