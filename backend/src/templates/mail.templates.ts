export const verificationMailTemplate = {
  subject: 'Welcome to {appName} | Verify Your Email',
  body: `
        <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
            <h2 style="margin-bottom: 0.5em;">Verify Your Account</h2>
            <p>Welcome to {appName}! Please verify your email to activate your account.</p>
            <p>Click the button below or enter the OTP provided (expires in 10 minutes).</p>

            <a href="{link}" 
               style="
                   display: inline-block; 
                   padding: 10px 20px; 
                   margin-top: 10px; 
                   background-color: #000; 
                   color: #fff; 
                   text-decoration: none; 
                   border-radius: 5px;
               ">
               Verify via Link
            </a>

            <p style="margin-top: 15px; font-size: 1.1em;">
                OTP: <b>{code}</b>
            </p>

            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                If you did not create an account, you can safely ignore this email.
            </p>
        </div>
    `,
};

export const passwordResetMailTemplate = {
  subject: '{appName} | Reset Your Password',
  body: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
            <h2 style="color: #111;">Reset Your Password</h2>
            <p>We received a request to reset the password for your {appName} account.</p>
            <p>Click the button below to set a new password. This link will expire in 10 minutes.</p>
            <a 
                href="{link}" 
                style="
                   display: inline-block; 
                   padding: 10px 20px; 
                   margin-top: 10px; 
                   background-color: #000; 
                   color: #fff; 
                   text-decoration: none; 
                   border-radius: 5px;
               "
            >
               Reset Password
            </a>
            <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
                If you didn't request a password reset, you can safely ignore this email.
            </p>
        </div>
    `,
};