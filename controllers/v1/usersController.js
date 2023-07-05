const User = require('../../models/User');

// Get logged in user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.user.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(204).json({ msg: 'No Users found' });
  }
  res.json(users);
}

module.exports = { getUser, deleteUser, getAllUsers };
