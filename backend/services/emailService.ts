import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Check if the user hasn't updated the placeholders yet
  const isPlaceholder = user?.includes('your_email') || pass?.includes('your_16_char');

  // Fallback to MOCK if credentials aren't set or are still placeholders
  if (!user || !pass || isPlaceholder) {
    console.log(`
    [📧 MOCK EMAIL SERVICE - GMAIL NOT CONFIGURED] 
    ---------------------------------------------------
    To: ${to}
    Subject: ${subject}
    ---------------------------------------------------
    (Update backend/.env with real Gmail credentials to send actual emails)
    `);
    return;
  }

  // Create Transporter (Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `"Synapse App" <${user}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
};

export const sendWelcomeEmail = async (user: { email: string; name: string }) => {
  const subject = "Welcome to Synapse! 🚀";
  const html = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #000; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Synapse</h1>
      </div>
      <div style="border: 1px solid #ddd; border-top: none; padding: 20px; border-radius: 0 0 10px 10px;">
        <h2>Welcome, ${user.name}!</h2>
        <p>We're thrilled to have you join Synapse.</p>
        <p>Get ready to turn your course materials into engaging, gamified lessons tailored just for you.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 20px;">If you have any questions, just reply to this email.</p>
      </div>
    </div>
  `;
  
  await sendEmail({ to: user.email, subject, html });
};

export const sendAnnouncementEmail = async (user: { email: string; name: string }, subject: string, message: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #22c55e;">📢 Update from Synapse</h2>
      <p>Hi ${user.name},</p>
      <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #22c55e; margin: 20px 0;">
        ${message}
      </div>
      <p>Happy Learning,<br/>The Synapse Team</p>
    </div>
  `;

  await sendEmail({ to: user.email, subject, html });
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  const subject = "Reset Your Password - Synapse";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #22c55e;">Reset Password Request</h2>
      <p>You requested a password reset. Please click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p style="font-size: 14px; background-color: #f5f5f5; padding: 10px; border-radius: 5px;">
        Or copy this link:<br/>
        <a href="${resetUrl}" style="color: #22c55e;">${resetUrl}</a>
      </p>
      <p style="font-size: 12px; color: #999;">This link expires in 10 minutes. If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({ to: email, subject, html });
};