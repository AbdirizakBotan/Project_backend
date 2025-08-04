# Gmail Setup Guide - Fix Authentication Error

## The Problem
You're getting this error: "Username and Password not accepted"

## Solution Steps:

### 1. Enable 2-Factor Authentication (Required)
1. Go to https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Find "2-Step Verification" and click "Get started"
4. Follow the steps to enable 2FA

### 2. Generate App Password
1. Go to https://myaccount.google.com/security
2. Scroll down to "2-Step Verification" and click on it
3. Scroll down to "App passwords"
4. Click "App passwords"
5. Select "Mail" from the dropdown
6. Click "Generate"
7. Copy the 16-character password (it looks like: xxxx xxxx xxxx xxxx)

### 3. Update Your .env File
Create or update the `.env` file in your backend folder:

```
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Important:**
- Use your full Gmail address (e.g., john.doe@gmail.com)
- Use the 16-character app password, NOT your regular Gmail password
- Remove spaces from the app password if any

### 4. Restart Your Server
```bash
cd backend
npm start
```

### 5. Test the Forgot Password
1. Go to your login page
2. Click "Forgot Password?"
3. Enter a valid email address
4. Check if the email is sent

## Alternative: Use a Test Email Service
If you want to test without Gmail setup, you can use Ethereal Email (for testing only):

Replace the emailService.js content with:

```javascript
const nodemailer = require('nodemailer');

// Create test account
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
    console.log('Email sent: ', info.messageId);
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail
};
```

This will show you a preview URL in the console where you can see the email content.

## Common Issues:
1. **Wrong password**: Make sure you're using the app password, not your regular Gmail password
2. **2FA not enabled**: You must enable 2-Factor Authentication first
3. **Wrong email format**: Use the full email address
4. **Spaces in app password**: Remove any spaces from the 16-character app password 