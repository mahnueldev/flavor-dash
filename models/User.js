const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  apikey: {
    type: String,
    required: true
  },
  roles: {
    type: String,
    enum: ['Admin', 'User'],
    default: 'User'
  },
  refreshToken: String,
  date: {
    type: Date,
    default: Date.now
  },
  otp: {
    type: String,
    ref: 'ResetOTP'
  },

});

module.exports = mongoose.model('user', UserSchema);
