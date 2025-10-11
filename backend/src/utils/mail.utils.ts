import ENV from '@src/common/ENV';
import { SMTPClient } from '@src/services/mail.service';
import Mail from 'nodemailer/lib/mailer';

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

export async function sendVerificationMail(to: string | Mail.Address | (string | Mail.Address)[], code: string) {
    return await SmtpClient.sendMail({
        to,
        subject: `${ENV.AppName} | Verify your email`,
        html: `<p>Your code: <strong>${code}</strong></p>`,
    });
}

export async function sendPasswordResetEmail(to: string | Mail.Address | (string | Mail.Address)[], code: string) {
    return await SmtpClient.sendMail({
        to,
        subject: `${ENV.AppName} | Reset your Password`,
        html: `<p>Use this code to reset your password: <strong>${code}</strong></p>`,
    });
}