const nodemailer = require('nodemailer');

// Create transporter for Gmail with better configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    console.log('🔧 Please check your .env file and Gmail settings');
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

// Function to send password reset email for users
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You have requested to reset your password. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Your Application Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

// Function to send password reset email for admins
const sendAdminPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `http://localhost:5173/admin-reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Admin Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5; text-align: center;">Admin Password Reset Request</h2>
          <p>Hello Admin,</p>
          <p>You have requested to reset your admin password. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Admin Password
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p>Best regards,<br>Your Application Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin email sent: ', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending admin email: ', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendAdminPasswordResetEmail
}; 