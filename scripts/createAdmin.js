const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../model/adminModel');

async function createAdmin() {
  await mongoose.connect('mongodb+srv://onlinebusinessr205:VE6F5g0tuYGDUyb7@cluster0.n0gzv4f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
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