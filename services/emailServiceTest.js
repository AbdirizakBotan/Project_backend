const nodemailer = require('nodemailer');

// Create test account for development/testing
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Function to send password reset email (TEST VERSION)
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = await createTestAccount();
    const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: '"Your App" <noreply@yourapp.com>',
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
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('🔗 Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('📱 Open the Preview URL in your browser to see the email content');
    return true;
  } catch (error) {
    console.error('❌ Error sending email: ', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
}; 