const mongoose = require('mongoose');
const Admin = require('../model/adminModel');

async function checkAdmins() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Business');
    console.log('Connected to database');

    // Find all admins
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin accounts:`);

    admins.forEach((admin, index) => {
      console.log(`\nAdmin ${index + 1}:`);
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email || 'NOT SET'}`);
      console.log(`  Has Reset Token: ${admin.resetToken ? 'YES' : 'NO'}`);
      console.log(`  Reset Token Expiry: ${admin.resetTokenExpiry || 'NOT SET'}`);
      console.log(`  Created: ${admin.createdAt}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

checkAdmins(); 