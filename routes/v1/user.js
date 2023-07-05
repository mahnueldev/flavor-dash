const express = require('express');
const router = express.Router();
const { getUser,deleteUser } = require('../../controllers/v1/usersController');

// Get logged in user
router.get('/',  getUser);
router.delete('/',  deleteUser);



module.exports = router;