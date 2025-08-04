const mongoose = require('mongoose');
const Admin = require('../model/adminModel');

async function migrateAdminEmail() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Business');
    console.log('Connected to database');

    // Find all admins without email
    const adminsWithoutEmail = await Admin.find({ email: { $exists: false } });
    console.log(`Found ${adminsWithoutEmail.length} admins without email`);

    if (adminsWithoutEmail.length === 0) {
      console.log('All admins already have email fields');
      return;
    }

    // Update each admin to add email field
    for (let i = 0; i < adminsWithoutEmail.length; i++) {
      const admin = adminsWithoutEmail[i];
      const email = `admin${i + 1}@business.com`;
      
      await Admin.findByIdAndUpdate(admin._id, { 
        email: email,
        resetToken: null,
        resetTokenExpiry: null
      });
      
      console.log(`Updated admin ${admin.username} with email: ${email}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

migrateAdminEmail(); 