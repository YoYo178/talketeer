export const verificationMailTemplate = {
    subject: `Welcome to {appName} | Verify your email`,
    body: `
        <h2>Verify Your Account</h2>
        <p>Click the link below or enter the OTP (Expires in 10 minutes):</p>
        <a href="{link}">Verify via Link</a>
        <p>OTP: <b>{code}</b></p>
    `
}

export const passwordResetMailTemplate = {
    subject: `{appName} | Reset your password`,
    body: `
        <h2>Reset Your Password</h2>
        <p>Click the link below or enter the OTP (Expires in 10 minutes):</p>
        <a href="{link}">Verify via Link</a>
        <p>OTP: <b>{code}</b></p>
    `
}