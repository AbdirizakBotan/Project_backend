const https = require('https');
const tls = require('tls');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 SSL/TLS Diagnostic Tool');
console.log('==========================\n');

// Test 1: Check Node.js SSL/TLS capabilities
console.log('1. Testing Node.js SSL/TLS Support:');
console.log('   Node.js version:', process.version);
console.log('   OpenSSL version:', process.versions.openssl);
console.log('   Available ciphers:', tls.getCiphers().length, 'ciphers');
console.log('   TLS version support: TLSv1.2, TLSv1.3');

// Test 2: Test HTTPS connection to Gmail
console.log('\n2. Testing HTTPS connection to Gmail:');
const testGmailConnection = () => {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'smtp.gmail.com',
      port: 465,
      method: 'GET',
      timeout: 10000,
      rejectUnauthorized: false
    }, (res) => {
      console.log('   ✅ HTTPS connection to Gmail successful');
      console.log('   Status:', res.statusCode);
      resolve();
    });

    req.on('error', (error) => {
      console.log('   ❌ HTTPS connection failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.log('   ⏰ Connection timeout');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
};

// Test 3: Test different SMTP configurations
console.log('\n3. Testing SMTP configurations:');

const testSMTPConfig = (config, name) => {
  return new Promise((resolve) => {
    const transporter = nodemailer.createTransport(config);
    
    transporter.verify((error, success) => {
      if (error) {
        console.log(`   ❌ ${name}:`, error.message);
      } else {
        console.log(`   ✅ ${name}: Connection successful`);
      }
      resolve({ error, success });
    });
  });
};

// Test 4: Environment variables check
console.log('\n4. Environment Variables Check:');
console.log('   EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

// Run all tests
async function runTests() {
  try {
    await testGmailConnection();
  } catch (error) {
    console.log('   ⚠️  Gmail connection test failed');
  }

  const configs = [
    {
      config: {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
      },
      name: 'Gmail Service (Default)'
    },
    {
      config: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: { rejectUnauthorized: false }
      },
      name: 'Gmail SMTP (Port 465, SSL)'
    },
    {
      config: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: { 
          rejectUnauthorized: false,
          minVersion: 'TLSv1.2'
        }
      },
      name: 'Gmail SMTP (Port 587, TLS)'
    }
  ];

  for (const { config, name } of configs) {
    await testSMTPConfig(config, name);
  }

  console.log('\n📋 Summary:');
  console.log('===========');
  console.log('If all tests fail, try these solutions:');
  console.log('1. Create a .env file in the backend folder with your Gmail credentials');
  console.log('2. Enable 2-Factor Authentication on your Gmail account');
  console.log('3. Generate an App Password (not your regular password)');
  console.log('4. Check your network/firewall settings');
  console.log('5. Try using a different port (465 vs 587)');
  console.log('6. Update your Node.js version if it\'s outdated');
}

runTests(); 