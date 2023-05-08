// Import required modules
const { validationResult } = require('express-validator');
const { sendPasswordResetEmail } = require('../utils/passwordResetUtils');
const crypto = require('crypto');
const User = require('../models/User');
const ResetCode = require('../models/ResetCode');

// Define the forgot password controller
const forgotPassword = async (req, res) => {
  // Validate the request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {userId, firstName, email } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  // Generate a random reset code
  const resetCode = crypto.randomInt(100000, 999999);
  const expirationDate = Date.now() + 3600000;

  // Create a new ResetCode document and link it to the user
  const resetcode = new ResetCode({
    userId: user.id,
    email,
    resetCode,
    expirationDate,
    
  });
  await resetcode.save();

  // Send the password reset email
  await sendPasswordResetEmail(firstName, email, resetCode);

  return res.status(200).json({ msg: 'Password reset email sent' });
};

const resetPassword = async (req, res) => {
  // Validate the request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, resetCode, password } = req.body;

  // Find the reset code associated with the user
  let resetcode = await ResetCode.findOne({ userId, resetCode, expirationDate: { $gt: Date.now() } });
  if (!resetcode) {
    return res.status(400).json({ msg: 'Invalid reset code or expired' });
  }

  // Find the user and update their password
  let user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }
  user.password = password;
  await user.save();

  // Destroy the resetCode
  await resetcode.remove();

  return res.status(200).json({ msg: 'Password reset successfully' });
};


module.exports = { forgotPassword, resetPassword };
