const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authApiKey = async (req, res, next) => {
  try {
    // Get the API key from the request headers
    const apiKey = req.headers['x-api-key'];
    
    // Get the API host from the request headers
    const apiHost = req.headers['x-api-host'];
    // console.log('API Key:', apiKey);
    // console.log('API Host:', apiHost);

    // Find the user associated with the API host
    const user = await User.findOne({ apiHost });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid API host' });
    }

    // Compare the provided API key with the encrypted value in the database
    const isMatch = await bcrypt.compare(apiKey, user.apiKey);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid API key' });
    }

    // Add the user object to the request object
    req.user = user;

    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = authApiKey;
