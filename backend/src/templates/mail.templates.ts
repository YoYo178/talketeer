export const verificationMailTemplate = `
    <h2>Verify Your Account</h2>
    <p>Click the link below or enter the OTP (Expires in 10 minutes):</p>
    <a href="{link}">Verify via Link</a>
    <p>OTP: <b>{otp}</b></p>
`

export const passwordResetMailTemplate = `
    <h2>Reset Your Password</h2>
    <p>Click the link below or enter the OTP (Expires in 10 minutes):</p>
    <a href="{link}">Verify via Link</a>
    <p>OTP: <b>{otp}</b></p>
`