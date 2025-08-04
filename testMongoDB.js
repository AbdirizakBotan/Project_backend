require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 MongoDB Connection Test');
console.log('==========================\n');

const MONGODB_URI = "mongodb+srv://abdirizakbotan:S5k1210RtcFnIymT@cluster0.j8w4gk2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log('Testing MongoDB connection...');
console.log('Connection string:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

// Test the connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port);
    
    // Test a simple operation
    return mongoose.connection.db.admin().listDatabases();
  })
  .then((result) => {
    console.log('\n📊 Available databases:');
    result.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    console.log('\n✅ MongoDB connection test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check your internet connection');
    console.log('2. Verify the MongoDB Atlas cluster is running');
    console.log('3. Check if your IP address is whitelisted in MongoDB Atlas');
    console.log('4. Verify the username and password are correct');
    console.log('5. Make sure the database name is correct');
    process.exit(1);
  }); 