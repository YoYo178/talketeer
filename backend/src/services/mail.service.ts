import { NodeEnvs } from '@src/common/constants';
import ENV from '@src/common/ENV';
import logger from '@src/utils/logger.utils';
import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Stream from 'stream';

interface SMTPClientInitOptions {
    appName: string;
    provider: string;
    email: string;
    password: string;
}

export class SMTPClient {
    private static instance: SMTPClient;

    private constructor(
        private readonly transporter: Transporter,
        private readonly appName: string,
        private readonly email: string,
        private readonly provider: string
    ) { }

    static init(options: SMTPClientInitOptions) {
        if (!SMTPClient.instance) {
            if (!options.provider || !options.email || !options.password)
                throw new Error('[SMTPClient] SMTP credentials not set. Initialization failed.');

            // The below 'host' and 'port' properties are overridden based on the 'service' value.
            // If you plan to use Ethereal for testing, you can generate test accounts manually
            // see: https://ethereal.email/
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                service: options.provider,
                auth: {
                    user: options.email,
                    pass: options.password,
                },
            });

            SMTPClient.instance = new SMTPClient(transporter, options.appName, options.email, options.provider);
            Object.freeze(SMTPClient.instance);
        } else {
            logger.warn('[SMTPClient] Attempted to initialize more than once!');
        }

        return SMTPClient.getInstance();
    }

    static getInstance(): SMTPClient {
        if (!SMTPClient.instance)
            throw new Error('[SMTPClient] getInstance() called before initialization!');

        return SMTPClient.instance;
    }

    public async sendMail({
        to,
        subject,
        text,
        html,
        attachments,
    }: {
        to: string | Mail.Address | (string | Mail.Address)[],
        subject: string,
        text?: string | Buffer | Stream.Readable,
        html?: string | Buffer | Stream.Readable,
        attachments?: Mail.Attachment[],
    }) {
        if (!this.transporter)
            return;

        const isDebug = [NodeEnvs.Dev, NodeEnvs.Test].includes(ENV.NodeEnv)
        const isEthereal = this.provider.toLowerCase() === 'ethereal';

        if (isDebug) {
            logger.info('[Ethereal] New mail draft:');
            logger.info({ from: `'${this.appName}' <${this.email}>`, to, subject, text, html, attachments });
        }

        const info: SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo = await this.transporter.sendMail({
            from: `'${this.appName}' <${this.email}>`,
            to,
            subject,
            text,
            html,
            attachments,
        });

        if (isDebug) {
            logger.info('[Ethereal] Message sent:');
            logger.info(info.messageId);

            if (isEthereal) {
                logger.info('[Ethereal] Preview URL:');
                logger.info(nodemailer.getTestMessageUrl(info));
            }
        }

        return info;
    }
}

SMTPClient.init({
    appName: ENV.AppName,
    email: ENV.SmtpEmail,
    password: ENV.SmtpPass,
    provider: ENV.SmtpProvider
})