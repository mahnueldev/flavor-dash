const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getLoggedInUser,
  authenticateUser,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Get logged in user
router.get('/', authMiddleware, getLoggedInUser);

// Authenticate user & get token
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authenticateUser
);

module.exports = router;
