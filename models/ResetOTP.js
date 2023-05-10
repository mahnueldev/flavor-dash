const mongoose = require('mongoose');

const ResetOTPSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    otp: {
      type: String,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

ResetOTPSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 600 }); // Index to expire documents after 10 minutes

module.exports = mongoose.model('ResetOTP', ResetOTPSchema);
