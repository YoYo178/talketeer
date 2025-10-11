import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Verification } from "@src/models";
import { IVerification } from '@src/types';

export async function generateVerificationObject(email: string, purpose: IVerification['purpose']) {
    await Verification.deleteMany({ email });

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(token, 10);
    const code = Math.floor(Math.random() * 900000).toString().padStart(6, '0');

    const verificationObj = await Verification.create({
        email,
        token: hashedToken,
        code,
        purpose
    })

    return [verificationObj.token, verificationObj.code]
}