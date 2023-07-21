const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}


const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ msg: 'Access Denied' });
  const accessToken= authHeader.split(' ')[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403); // invalid token
      req.user = decoded.user; // Store just the user ID
      req.roles = decoded.roles; // Store the roles
      next();
    }
  );
};

module.exports = verifyJWT;
