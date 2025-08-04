const mongoose = require('mongoose');
const Admin = require('../model/adminModel');
const User = require('../model/userModel');

async function clearTokens() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Business');
    console.log('Connected to database');

    // Clear admin tokens
    const adminResult = await Admin.updateMany({}, {
      $unset: { resetToken: "", resetTokenExpiry: "" }
    });
    console.log(`Cleared tokens from ${adminResult.modifiedCount} admin accounts`);

    // Clear user tokens
    const userResult = await User.updateMany({}, {
      $unset: { resetToken: "", resetTokenExpiry: "" }
    });
    console.log(`Cleared tokens from ${userResult.modifiedCount} user accounts`);

    console.log('All reset tokens cleared successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

clearTokens(); 