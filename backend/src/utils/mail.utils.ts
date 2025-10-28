import Mail from 'nodemailer/lib/mailer';

import ENV from '@src/common/ENV';
import { SMTPClient } from '@src/services/mail.service';

import { passwordResetMailTemplate, verificationMailTemplate } from '@src/templates/mail.templates';

const SmtpClient = SMTPClient.getInstance();

export function obfuscateEmail(email: string) {
  const [user, domain] = email.split('@');

  const obfuscatedUser = user.length <= 2
    ? user[0] + '*'
    : user.slice(0, 3) + '*'.repeat(user.length - 6) + user.slice(-3);

  const [domainName, domainTLD] = domain.split('.');
  const obfuscatedDomain = domainName[0] + '*'.repeat(domainName.length - 1);

  return `${obfuscatedUser}@${obfuscatedDomain}.${domainTLD}`;
}

export async function sendVerificationMail(to: string | Mail.Address | (string | Mail.Address)[], userId: string, code: string, token: string) {
  const link = `${ENV.FrontendOrigin}/talketeer/auth/verify?userId=${userId}&token=${token}`;

  return await SmtpClient.sendMail({
    to,
    subject: verificationMailTemplate.subject.replace('{appName}', ENV.AppName),
    html: verificationMailTemplate.body
      .replace('{appName}', ENV.AppName)
      .replace('{link}', link)
      .replace('{code}', code),
  });
}

export async function sendPasswordResetMail(to: string | Mail.Address | (string | Mail.Address)[], userId: string, token: string) {
  const link = `${ENV.FrontendOrigin}/talketeer/auth/reset?userId=${userId}&token=${token}`;

  return await SmtpClient.sendMail({
    to,
    subject: passwordResetMailTemplate.subject.replace('{appName}', ENV.AppName),
    html: passwordResetMailTemplate.body
      .replace('{appName}', ENV.AppName)
      .replace('{link}', link),
  });
}