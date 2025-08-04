require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔧 Testing with New MongoDB User');
console.log('================================\n');

// Instructions for creating a new user
console.log('📋 Instructions:');
console.log('1. Go to MongoDB Atlas → Database Access');
console.log('2. Click "Add New Database User"');
console.log('3. Username: businessapp');
console.log('4. Password: BusinessApp2024!');
console.log('5. Role: "Atlas admin"');
console.log('6. Click "Add User"');
console.log('7. Go to Network Access → Add IP Address → Allow Access from Anywhere');
console.log('');

// Test connection with new user
const NEW_MONGODB_URI = "mongodb+srv://businessapp:BusinessApp2024!@business.i9x2ukr.mongodb.net/?retryWrites=true&w=majority&appName=business";

console.log('🧪 Testing new user connection...');
console.log('URI:', NEW_MONGODB_URI.replace(/\/\/.*@/, '//***:***@'));

mongoose.connect(NEW_MONGODB_URI)
  .then(() => {
    console.log('✅ SUCCESS! New user connection works!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    
    console.log('\n🎉 Use this connection string in your server.js:');
    console.log('MONGODB_URI="mongodb+srv://businessapp:BusinessApp2024!@business.i9x2ukr.mongodb.net/?retryWrites=true&w=majority&appName=business"');
    
    process.exit(0);
  })
  .catch((error) => {
    console.log('❌ New user connection failed:', error.message);
    console.log('\n🔧 Please follow the instructions above to create the new user.');
    process.exit(1);
  }); 