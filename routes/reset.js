const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { generateOTP, resetPassword } = require('../controllers/passwordResetController');

router.post('/forgot-password', generateOTP);

router.post('/reset-password', [
    check('otp').isNumeric().withMessage('Reset otp must be a number'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ], resetPassword);

module.exports = router;
