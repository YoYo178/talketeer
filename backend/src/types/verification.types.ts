export interface IVerification {
    email: string;
    purpose: 'email-verification' | 'password-reset';
    token: string;
    code: string;

    createdAt?: Date;
}