import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create a transporter object using the default SMTP transport for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email transporter configuration:', error);
        console.log('Please ensure EMAIL_USER and EMAIL_PASS are set correctly in the .env file.');
        console.log('For Gmail, you must use an "App Password". See: https://support.google.com/accounts/answer/185833');
    } else {
        console.log('Email transporter is ready to send messages.');
    }
});

export default transporter;
