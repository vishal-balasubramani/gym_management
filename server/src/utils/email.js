import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use an "App Password" if using Gmail
  },
  tls: {
    rejectUnauthorized: false // This bypasses local SSL certificate errors
  }
});

export const sendEmail = async (options) => {
  const mailOptions = {
    from: `"Fit Hub Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};