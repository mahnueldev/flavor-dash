const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { generateOTP, otpResetPassword } = require('../controllers/otpPasswordResetController');
const { generateURL, urlResetPassword } = require('../controllers/urlpasswordResetController');

router.post('/otp/forgot-password', generateOTP);

router.post('/otp/reset-password', [
    check('otp').isNumeric().withMessage('Reset otp must be a number'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ], otpResetPassword);

router.post('/link/forgot-password', generateURL);

router.post('/link/reset-password', [
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ], urlResetPassword);

module.exports = router;
