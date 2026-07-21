import crypto from 'crypto';
import argon2 from 'argon2';
import { Verification } from '@src/models/verification.model.js';
import type { IVerification } from '@src/types/verification.types.js';

export async function getVerificationObject(userId: string) {
  const obj = await Verification.findOne({ userId }).lean().exec()
  return obj;
}

export async function generateVerificationObject(
  userId: string,
  purpose: IVerification['purpose'],
) {
  await cleanupVerification(userId);

  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = await argon2.hash(token);
  const code = Math.floor(Math.random() * 900000)
    .toString()
    .padStart(6, '0');

  const verificationObj = await Verification.create({
    userId,
    token: hashedToken,
    code,
    purpose,
  });

  return [token, verificationObj.code];
}

export async function cleanupVerification(userId: string) {
  await Verification.deleteMany({ userId });
}
