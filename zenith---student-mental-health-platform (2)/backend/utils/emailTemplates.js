import 'dotenv/config';

export const getDailyReminderEmail = (userName) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return {
        subject: 'Daily Mental Health Check-in Reminder',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h1 style="color: #4A90E2; text-align: center;">Zenith</h1>
                    <p>Hi ${userName},</p>
                    <p>Just a friendly reminder to take a moment for yourself today. Your daily check-in is a great way to stay mindful of your well-being.</p>
                    <p>It only takes a minute and helps you track your mental health journey.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${frontendUrl}/#/survey" style="background-color: #4A90E2; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Take Your Daily Survey</a>
                    </div>
                    <p>Wishing you a calm and balanced day.</p>
                    <p>Best,<br/>The Zenith Team</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                    <p style="text-align: center; font-size: 12px; color: #aaa;">
                        If you did not sign up for this service, please disregard this email.
                    </p>
                </div>
            </div>
        `,
    };
};

export const getPasswordResetEmail = (userName, resetUrl) => {
    return {
        subject: 'Your Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h1 style="color: #4A90E2; text-align: center;">Zenith</h1>
                    <p>Hi ${userName},</p>
                    <p>You recently requested to reset your password for your Zenith account. Click the button below to reset it.</p>
                    <p>This password reset link is only valid for the next 60 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #4A90E2; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Your Password</a>
                    </div>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <p>Thanks,<br/>The Zenith Team</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
                    <p style="text-align: center; font-size: 12px; color: #aaa;">
                        If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:
                        <br/>
                        <a href="${resetUrl}" style="color: #999;">${resetUrl}</a>
                    </p>
                </div>
            </div>
        `,
    };
};
