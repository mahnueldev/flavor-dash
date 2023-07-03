// Import required modules
const { sendURLEmail } = require('../utils/authMailer');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const generateURL = async (req, res) => {
  try {
    // Get user email from request body
    const { email } = req.body;

    // Check if a user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate JWT token with user ID and secret key
    const token = jwt.sign({ _id: user._id }, config.get('accessTokenSecret'), {
      expiresIn: '30m',
    });

    // Generate the reset password URL with the token
    const resetURL = `${config.get('frontendURL')}/reset-password/${token}`;

    // Send the reset password email to the user
    await sendURLEmail(user.firstName, user.email, resetURL);

    res.status(200).json({ msg: 'Reset password link sent to your email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

const urlResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.params.token;
    console.log({ token });
    console.log('Req Body:', password);

    // Verify the token
    const decodedToken = await jwt.verify(
      token,
      config.get('accessTokenSecret')
    );
    if (!decodedToken) {
      return res.status(401).json({ msg: 'Invalid token' });
    }
    const userId = decodedToken._id;

    // Find the user with the given ID
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    console.log(typeof newPassword);
    // Update the user's password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { generateURL, urlResetPassword };
