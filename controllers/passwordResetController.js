// Import required modules
const { validationResult } = require('express-validator');
const { sendPasswordResetEmail } = require('../utils/passwordResetUtils');
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ResetCode = require('../models/ResetCode');

// Define the forgot password controller
const forgotPassword = async (req, res) => {
  // Validate the request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, firstName, email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  // Find the existing reset code document for the user
  let resetcode = await ResetCode.findOneAndUpdate({ userId });

  // If a reset code document already exists, update it with a new reset code and expiration date
  if (resetcode) {
    resetcode.resetCode = crypto.randomInt(100000, 999999);
    resetcode.expirationDate = Date.now() + 3600000;
    await resetcode.save();
  } else {
    // Otherwise, create a new reset code document and link it to the user
    resetcode = new ResetCode({
      userId: user.id,
      resetCode: crypto.randomInt(100000, 999999),
      expirationDate: Date.now() + 3600000,
    });
    await resetcode.save();
  }

  // Send the password reset email
  await sendPasswordResetEmail(firstName, email, resetcode.resetCode);

  return res.status(200).json({ msg: 'Password reset email sent' });
};

const resetPassword = async (req, res) => {
  // Validate the request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, resetCode, password } = req.body;

  // Find the user with the given email address
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  // Find the reset code document for the user
  const resetcode = await ResetCode.findOne({ userId: user.id });
  if (!resetcode) {
    return res.status(400).json({ msg: 'Reset code not found' });
  }

  // Check if the reset code is valid and has not expired
  if (resetcode.resetCode !== resetCode || resetcode.expirationDate < Date.now()) {
    return res.status(400).json({ msg: 'Invalid or expired reset code' });
  }


  // Update the user's password and delete the reset code document
  user.password = password;
  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  
  await user.save();
  await resetcode.deleteOne();

  return res.status(200).json({ msg: 'Password reset successful' });
};

module.exports = { forgotPassword, resetPassword };
