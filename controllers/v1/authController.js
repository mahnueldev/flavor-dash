const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { validationResult } = require('express-validator');
const User = require('../../models/User');

// Authenticate user & get token
const authenticateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    if (user.roles !== 'User') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }
    const roles = user.roles;
    const accessToken = jwt.sign(
      { user: { id: user.id, roles: user.roles } },

      config.get('accessTokenSecret'),
      { expiresIn: '10m' }
    );

    const refreshToken = jwt.sign(
      { user: { id: user.id } },
      config.get('refreshTokenSecret'),
      { expiresIn: '1d' }
    );

    // Store refreshToken in database
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwtCookie', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ roles, accessToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { authenticateUser };
