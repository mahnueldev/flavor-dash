const express = require('express');
const router = express.Router();
const {  getAllUsers } = require('../../controllers/v1/usersController');
const isAdmin = require('../../middleware/isAdmin');

// Get users

router.get('/', isAdmin, getAllUsers);


module.exports = router;