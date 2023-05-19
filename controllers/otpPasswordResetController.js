// Import required modules
const { validationResult } = require('express-validator');
const { sendOTPEmail  } = require('../utils/authMailer');
const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const ResetOTP = require('../models/ResetOTP');

// Define the forgot password controller
const generateOTP = async (req, res) => {
  // Validate the request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {  email } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  // Find the existing reset code document for the user
  let resetotp = await ResetOTP.findOne({ userId: user.id  });
  

  // Generate a plain-text OTP
  const plainOTP = crypto.randomInt(100000, 999999);

  // Hash the OTP and save it to the database
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(plainOTP.toString(), salt);

  if (resetotp) {
    // Update the existing reset code document with the new hashed OTP and expiration date
    resetotp.otp = hashedOTP;
    await resetotp.save();
  } else {
    // Create a new reset code document and link it to the user
    resetotp = new ResetOTP({
      userId: user.id,
      otp: hashedOTP,
    });
    await resetotp.save();
  }
let firstName = user.firstName;
  // Send the plain-text OTP to the user's email address
  await sendOTPEmail(firstName, email, plainOTP);

  return res.status(200).json({ msg: 'Password reset OTP email sent' });
};


const otpResetPassword = async (req, res) => {
  // Validate the request parameters
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp, password } = req.body;

  // Find the user with the given email address
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  // Find the reset code document for the user
  const resetotp = await ResetOTP.findOne({ userId: user.id });
  if (!resetotp) {
    return res.status(400).json({ msg: 'Reset otp not found' });
  }
  
 // Compare the entered OTP with the hashed OTP in the database
const isMatch = await bcrypt.compare(otp.toString(), resetotp.otp);
if (!isMatch) {
  return res.status(400).json({ msg: 'Invalid credentials' });
}

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  
  // Update the user's password and delete the reset code document
  user.password = newPassword;
  await user.save();
  await resetotp.deleteOne();

  return res.status(200).json({ msg: 'Password reset successful' });
};

module.exports = { generateOTP, otpResetPassword };
