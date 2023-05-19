// Import required modules
const { validationResult } = require('express-validator');
const { sendURLEmail } = require('../utils/authMailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const generateURL = async (req, res) => {
  try {
    // Get user email from request body
    const { email } = req.body;

    // Check if user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    // Generate JWT token with user id and secret key
    const token = jwt.sign({ userId: user.id }, config.get('accessTokenSecret'), {
      expiresIn: '30m',
    });

    // Generate reset password URL with token
    const resetURL = `${config.get(
      'frontendURL'
    )}/reset-password/${token}`;

    // Send reset password email to user
    await sendURLEmail(user.firstName, user.email, resetURL);

    res.status(200).json({ msg: 'Reset password link sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

const urlResetPassword = async (req, res) => {
  try {
    // Get user id and new password from request body
    const { userId, password } = req.body;

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ msg: 'Server error' }] });
  }
};

module.exports = { generateURL, urlResetPassword };
