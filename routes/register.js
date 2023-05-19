// routes/users.js
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { createUser } = require('../controllers/registerController');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    check('firstName', 'Please add first name').not().isEmpty(),
    check('lastName', 'Please add last name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  createUser
);

module.exports = router;
