const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: false, // Make it optional for existing admins
    unique: true,
    sparse: true // Allow multiple null values
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema); 