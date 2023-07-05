const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { generateURL, urlResetPassword } = require('../../controllers/v1/urlpasswordResetController');



router.post('/link/forgot-password', generateURL);

router.post('/link/reset-password/:token', [
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  ], urlResetPassword);

module.exports = router;
