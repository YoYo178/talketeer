import dns from 'dns/promises';
import Mail from 'nodemailer/lib/mailer/index.js';

import ENV from '@src/common/env.js';
import HTTP_STATUS_CODES from '@src/common/HttpStatusCodes.js';
import { SMTPClient } from '@src/services/mail.service.js';

import {
  passwordResetMailTemplate,
  verificationMailTemplate,
} from '@src/templates/mail.templates.js';
import { APIError } from './api.utils.js';

const SmtpClient = SMTPClient.getInstance();

export async function validateEmailMx(email: string) {
  const domain = email.split('@')[1] ?? '';

  if (!domain)
    throw new APIError(
      'Something went wrong!',
      HTTP_STATUS_CODES.InternalServerError,
    );

  const mxRecords = await dns.resolveMx(domain).catch(() => []);
  if (!mxRecords.length)
    throw new APIError('Invalid email address', HTTP_STATUS_CODES.BadRequest);
}

export function obfuscateEmail(email: string) {
  const [user = '', domain = ''] = email.split('@');

  const obfuscatedUser =
    user.length <= 2
      ? user[0] + '*'
      : user.slice(0, 3) + '*'.repeat(user.length - 6) + user.slice(-3);

  const [domainName = '', domainTLD = ''] = domain.split('.');
  const obfuscatedDomain = domainName[0] + '*'.repeat(domainName.length - 1);

  return `${obfuscatedUser}@${obfuscatedDomain}.${domainTLD}`;
}

export async function sendVerificationMail(
  to: string | Mail.Address | (string | Mail.Address)[],
  userId: string,
  code: string,
  token: string,
) {
  const link = `${ENV.FRONTEND_ORIGIN}/talketeer/auth/verify?userId=${userId}&token=${token}`;

  return await SmtpClient.sendMail({
    to,
    subject: verificationMailTemplate.subject.replace(
      '{appName}',
      ENV.APP_NAME,
    ),
    html: verificationMailTemplate.body
      .replace('{appName}', ENV.APP_NAME)
      .replace('{link}', link)
      .replace('{code}', code),
  });
}

export async function sendPasswordResetMail(
  to: string | Mail.Address | (string | Mail.Address)[],
  userId: string,
  token: string,
) {
  const link = `${ENV.FRONTEND_ORIGIN}/talketeer/auth/reset?userId=${userId}&token=${token}`;

  return await SmtpClient.sendMail({
    to,
    subject: passwordResetMailTemplate.subject.replace(
      '{appName}',
      ENV.APP_NAME,
    ),
    html: passwordResetMailTemplate.body
      .replace('{appName}', ENV.APP_NAME)
      .replace('{link}', link),
  });
}
