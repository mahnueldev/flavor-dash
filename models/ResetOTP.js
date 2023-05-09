const mongoose = require('mongoose');

const ResetOTPSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  otp: {
    type: String,
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    index: { expires: '10m' },
  },
 
});

module.exports = mongoose.model('ResetOTP', ResetOTPSchema);
