const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { authenticateUser } = require('../../controllers/v1/authController');

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
