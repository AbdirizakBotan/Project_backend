const mongoose = require('mongoose');
const Admin = require('../model/adminModel');
const User = require('../model/userModel');

async function debugToken() {
  try {
    await mongoose.connect('mongodb+srv://onlinebusinessr205:PzLXaCD2hsyCoMz8@business.i9x2ukr.mongodb.net/?retryWrites=true&w=majority&appName=business');
    console.log('Connected to database');

    // Check admin tokens
    console.log('\n=== ADMIN TOKENS ===');
    const admins = await Admin.find({});
    admins.forEach((admin, index) => {
      console.log(`\nAdmin ${index + 1}:`);
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email || 'NOT SET'}`);
      console.log(`  Reset Token: ${admin.resetToken || 'NOT SET'}`);
      console.log(`  Reset Token Expiry: ${admin.resetTokenExpiry || 'NOT SET'}`);
      if (admin.resetTokenExpiry) {
        const now = new Date();
        const isExpired = now > admin.resetTokenExpiry;
        console.log(`  Is Expired: ${isExpired ? 'YES' : 'NO'}`);
        console.log(`  Time Left: ${Math.floor((admin.resetTokenExpiry - now) / 1000 / 60)} minutes`);
      }
    });

    // Check user tokens
    console.log('\n=== USER TOKENS ===');
    const users = await User.find({});
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`  Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Reset Token: ${user.resetToken || 'NOT SET'}`);
      console.log(`  Reset Token Expiry: ${user.resetTokenExpiry || 'NOT SET'}`);
      if (user.resetTokenExpiry) {
        const now = new Date();
        const isExpired = now > user.resetTokenExpiry;
        console.log(`  Is Expired: ${isExpired ? 'YES' : 'NO'}`);
        console.log(`  Time Left: ${Math.floor((user.resetTokenExpiry - now) / 1000 / 60)} minutes`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

debugToken(); 