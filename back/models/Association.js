const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    default: ''
  },
  wilaya: {
    type: String,
    required: true,
    default: ''
  },
  address: {
    type: String,
    required: true,
    default: ''
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  category: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Association', associationSchema);
