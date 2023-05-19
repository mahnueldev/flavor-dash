const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/usersController');

// Get logged in user
router.get('/',  getUser);


module.exports = router;