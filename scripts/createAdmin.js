const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../model/adminModel');

async function createAdmin() {
  await mongoose.connect('mongodb://localhost:27017/Business');
  const username = 'group';
  const email = 'admin@business.com'; // Add email
  const password = 'admin123';
  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, email, password: hashed });
  await admin.save();
  console.log('Admin user created:', username, 'with email:', email);
  mongoose.disconnect();
}

createAdmin(); 