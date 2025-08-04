const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
    enum: [
      'sole',
      'partnership',
      'private_company',
      'public_company',
      'ngo',
      'cooperative',
      'freelancer',
      'online',
      'retail',
      'manufacturer',
    ],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema); 