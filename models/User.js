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
    enum: ['admin', 'editor'],
    default: 'editor'
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetCode: {
    type: Number,
    ref: 'ResetCode'
  },
  resetCodeExpiration: {
    type: Date
  }
});

module.exports = mongoose.model('user', UserSchema);
