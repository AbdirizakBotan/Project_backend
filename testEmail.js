require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Gmail configuration...');
console.log('Email User:', process.env.EMAIL_USER || 'Not set');
console.log('Email Pass:', process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure 2-Factor Authentication is enabled on your Gmail account');
    console.log('2. Generate an App Password (not your regular password)');
    console.log('3. Check your .env file has the correct credentials');
    console.log('4. Make sure .env file is in the backend folder');
  } else {
    console.log('✅ Server is ready to send emails!');
    
    // Optional: Send a test email
    console.log('\n📧 Sending test email...');
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself as a test
      subject: 'Test Email from Business App',
      text: 'This is a test email to verify your Gmail configuration is working correctly.',
      html: '<h2>Test Email</h2><p>This is a test email to verify your Gmail configuration is working correctly.</p>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log('❌ Test email failed:', error.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
      process.exit(0);
    });
  }
}); 