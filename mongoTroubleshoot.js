require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Troubleshooting Tool');
console.log('================================\n');

// Test different connection strings
const connectionStrings = [
  {
    name: 'Current Connection String',
    uri: "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  },
  {
    name: 'Environment Variable',
    uri: process.env.MONGODB_URI
  },
  {
    name: 'Alternative Format',
    uri: "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/business?retryWrites=true&w=majority"
  }
];

async function testConnection(connectionString, name) {
  return new Promise((resolve) => {
    if (!connectionString) {
      console.log(`❌ ${name}: No connection string provided`);
      resolve(false);
      return;
    }

    console.log(`Testing ${name}...`);
    console.log('URI:', connectionString.replace(/\/\/.*@/, '//***:***@'));

    const testMongoose = mongoose.createConnection(connectionString, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    testMongoose.on('connected', () => {
      console.log(`✅ ${name}: Connection successful!`);
      console.log(`   Database: ${testMongoose.db.databaseName}`);
      testMongoose.close();
      resolve(true);
    });

    testMongoose.on('error', (error) => {
      console.log(`❌ ${name}: ${error.message}`);
      if (error.message.includes('bad auth')) {
        console.log('   🔧 This is an authentication error. Check username/password.');
      } else if (error.message.includes('ENOTFOUND')) {
        console.log('   🔧 This is a DNS resolution error. Check the hostname.');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log('   🔧 This is a connection refused error. Check if MongoDB Atlas is accessible.');
      }
      testMongoose.close();
      resolve(false);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      console.log(`⏰ ${name}: Connection timeout`);
      testMongoose.close();
      resolve(false);
    }, 10000);
  });
}

async function runTests() {
  console.log('🧪 Running connection tests...\n');

  for (const { name, uri } of connectionStrings) {
    await testConnection(uri, name);
    console.log(''); // Empty line for readability
  }

  console.log('📋 Troubleshooting Guide:');
  console.log('==========================');
  console.log('1. 🔐 Authentication Issues:');
  console.log('   - Go to MongoDB Atlas → Database Access');
  console.log('   - Verify username: abdirizakbotan');
  console.log('   - Reset password if needed');
  console.log('   - Ensure user has proper permissions');
  console.log('');
  console.log('2. 🌐 Network Issues:');
  console.log('   - Go to MongoDB Atlas → Network Access');
  console.log('   - Add your IP address to whitelist');
  console.log('   - Or temporarily allow all IPs (0.0.0.0/0)');
  console.log('');
  console.log('3. 🔧 Connection String Issues:');
  console.log('   - Verify cluster name: cluster0.j8w4gk2.mongodb.net');
  console.log('   - Check if cluster is active in MongoDB Atlas');
  console.log('   - Ensure you\'re using the correct connection string format');
  console.log('');
  console.log('4. 📧 Environment Variables:');
  console.log('   - Check if .env file exists in backend folder');
  console.log('   - Verify MONGODB_URI is set correctly');
  console.log('   - Restart your application after changing .env');
}

runTests(); 