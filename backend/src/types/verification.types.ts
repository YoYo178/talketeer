export interface IVerification {
    email: string;
    purpose: 'email-verification' | 'reset-password';
    token: string;
    code: string;

    createdAt?: Date;
}