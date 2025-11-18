import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import 'dotenv/config';

// Import local modules
import connectDB from './config/db.js';
import transporter from './config/email.js';
import { getDailyReminderEmail } from './utils/emailTemplates.js';
import { getUsersForDailyReminder } from './services/userService.js';

// Import routes
import surveyRoutes from './routes/survey.js';
import authRoutes from './routes/auth.js';

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json()); // To accept JSON data in the body

// Define Routes
app.use('/api/survey', surveyRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Zenith Backend is running.');
});

// --- Scheduled Email Job ---
// This cron job is scheduled to run at 8:00 AM every day.
// Cron format: minute hour day-of-month month day-of-week
// '0 8 * * *' means at minute 0 of hour 8, every day, every month, every day of the week.
console.log('Scheduling daily reminder email job...');
cron.schedule('0 8 * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running the daily reminder email job...`);
    
    try {
        const users = await getUsersForDailyReminder();
        
        if (!users || users.length === 0) {
            console.log('No users to send reminders to today.');
            return;
        }

        // Using Promise.allSettled to send emails in parallel without stopping if one fails
        const emailPromises = users.map(user => {
            const { subject, html } = getDailyReminderEmail(user.name);
            const mailOptions = {
                from: `"Zenith Platform" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: subject,
                html: html,
            };
            return transporter.sendMail(mailOptions);
        });

        const results = await Promise.allSettled(emailPromises);

        results.forEach((result, index) => {
            const user = users[index];
            if (result.status === 'fulfilled') {
                console.log(`Reminder email sent successfully to ${user.email}`);
            } else {
                console.error(`Failed to send reminder email to ${user.email}:`, result.reason);
            }
        });

        console.log('Daily reminder job finished.');

    } catch (error) {
        console.error('An error occurred during the daily reminder job:', error);
    }
}, {
    scheduled: true,
    timezone: "America/New_York" // Example: Use a specific timezone for consistency
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log('To test the email job immediately, you can temporarily change the cron schedule in server.js to "* * * * *" (runs every minute).');
});