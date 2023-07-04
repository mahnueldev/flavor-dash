const isAdmin = (req, res, next) => {
  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  // Check if the user has the admin role
  if (req.user.roles !== 'Admin') {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  // User is authenticated and has the admin role, proceed to the next middleware or route handler
  next();
};

module.exports = isAdmin;