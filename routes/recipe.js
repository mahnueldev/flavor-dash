const express = require('express');
const router = express.Router();
const { createRecipe, getRecipe, updateRecipe, deleteRecipe, deleteRecipeById } = require('../controllers/recipeController');
const { singleUpload } = require('../utils/multerConn');
const verifyJWT = require('../middleware/verifyJWT');
const limiter = require('../middleware/limiter');
const authApiKey = require('../middleware/authApiKey');
const isAdmin = require('../middleware/isAdmin');

// Create recipe
router.post('/', verifyJWT, singleUpload('image'),  createRecipe);
// Get recipe
router.get('/', authApiKey, limiter, getRecipe);
// Update recipe
router.put('/',  updateRecipe);
// Delete recipe
router.delete('/',  verifyJWT, deleteRecipe);
// Delete recipe by Id
router.delete('/:id',  verifyJWT, deleteRecipeById );


module.exports = router;