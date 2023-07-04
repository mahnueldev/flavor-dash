const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const { sendApiKeyEmail } = require('../utils/authMailer');
const crypto = require('crypto');

const User = require('../models/User');

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const uuid = uuidv4().substring(0, 15);
    const hash = crypto.createHash('sha512').update(uuid).digest('base64').substring(0, 15);
    const randIndex = Math.floor(Math.random() * hash.length);
    const apiKey =
      hash.substring(0, randIndex) +
      hash.charAt(randIndex).toUpperCase() +
      hash.substring(randIndex + 1) +
      '_' +
      uuid.substring(uuid.length - 5).toUpperCase();

    user = new User({
      firstName,
      lastName,
      email,
      password,
      roles: 'User',
      apiKey: await bcrypt.hash(apiKey, 10)
    });
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(password, salt);
    await user.save();
    await sendApiKeyEmail(firstName, email, apiKey);

    res.json({ msg: 'User created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { createUser };
