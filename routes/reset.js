const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { forgotPassword, resetPassword } = require('../controllers/passwordResetController');

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', [
    check('resetCode').isNumeric().withMessage('Reset code must be a number'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ], resetPassword);

module.exports = router;
