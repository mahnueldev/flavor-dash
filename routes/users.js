// routes/users.js

const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const usersController = require('../controllers/usersController');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  usersController.createUser
);

module.exports = router;
