const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../model/adminModel');

async function createAdmin() {
  await mongoose.connect('mongodb+srv://onlinebusinessr205:PzLXaCD2hsyCoMz8@business.i9x2ukr.mongodb.net/?retryWrites=true&w=majority&appName=business');
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