const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development.local' });
} else {
  dotenv.config({ path: '.env.production.local' });
}

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwtCookie) return res.sendStatus(401);
  const refreshToken = cookies.jwtCookie;

  const user = await User.findOne({ refreshToken }).exec();
  if (!user) return res.sendStatus(403); // Forbidden
  // Evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.user.id) return res.sendStatus(403);
    const roles = user.roles;
    const accessToken = jwt.sign(
      
      { user: { id: user.id, roles: user.roles } },
   
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '5s' }
    );
    res.json({ roles, accessToken });
  });
};

module.exports = { handleRefreshToken };
