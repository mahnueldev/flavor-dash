// routes/users.js
const express = require('express');
const router = express.Router();
const refreshTokenController = require('../../controllers/v1/refreshTokenController')
router.get('/', refreshTokenController.handleRefreshToken);

module.exports = router;
