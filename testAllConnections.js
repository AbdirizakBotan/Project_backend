require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing All MongoDB Connection Formats');
console.log('=========================================\n');

const connectionTests = [
  {
    name: 'Standard Format',
    uri: "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  },
  {
    name: 'With Database Name',
    uri: "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/business?retryWrites=true&w=majority"
  },
  {
    name: 'With Admin Database',
    uri: "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/admin?retryWrites=true&w=majority"
  },
  {
    name: 'Simplified Format',
    uri: "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/"
  },
  {
    name: 'Environment Variable',
    uri: process.env.MONGODB_URI
  }
];

async function testConnection(connectionString, name) {
  return new Promise((resolve) => {
    if (!connectionString) {
      console.log(`❌ ${name}: No connection string provided`);
      resolve(false);
      return;
    }

    console.log(`🧪 Testing: ${name}`);
    console.log(`   URI: ${connectionString.replace(/\/\/.*@/, '//***:***@')}`);

    const testMongoose = mongoose.createConnection(connectionString, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    testMongoose.on('connected', () => {
      console.log(`✅ ${name}: SUCCESS!`);
      console.log(`   Database: ${testMongoose.db.databaseName}`);
      testMongoose.close();
      resolve(true);
    });

    testMongoose.on('error', (error) => {
      console.log(`❌ ${name}: ${error.message}`);
      testMongoose.close();
      resolve(false);
    });

    setTimeout(() => {
      console.log(`⏰ ${name}: Timeout`);
      testMongoose.close();
      resolve(false);
    }, 10000);
  });
}

async function runAllTests() {
  console.log('🚀 Starting connection tests...\n');

  let successCount = 0;
  
  for (const { name, uri } of connectionTests) {
    const success = await testConnection(uri, name);
    if (success) successCount++;
    console.log(''); // Empty line
  }

  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Successful connections: ${successCount}`);
  console.log(`❌ Failed connections: ${connectionTests.length - successCount}`);
  
  if (successCount === 0) {
    console.log('\n🚨 All connections failed!');
    console.log('Please follow the MongoDB_Fix_Guide.md instructions.');
  } else {
    console.log('\n🎉 At least one connection worked!');
    console.log('Use the working connection string in your server.js');
  }
}

runAllTests(); 