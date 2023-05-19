const User = require('../models/User');

const authApiKey = async (req, res, next) => {
  try {
    // Get the API key from the request headers
    const apiKey = req.headers['x-api-key'];

    // Find the user associated with the API key
    const user = await User.findOne({ apiKeys: apiKey });

    if (!user) {
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
