const Recipe = require('../../models/Recipe');
const {uploadToCloudinary, deleteFromCloudinaryById, deleteAllFromCloudinary} = require('../../utils/cloudinaryUtils');

const createRecipe = async (req, res) => {
    try {
      const { title, description, ingredients, difficulty, cuisine, nutri_info,  tags } = req.body;
      const image = req.file.path;
  
      // Upload image to Cloudinary
      const cloudinaryUpload = await uploadToCloudinary(image, {
        folder: 'recipes', // Specify the folder where the image should be stored in Cloudinary
      });
  
      // Create new recipe document
      const newRecipe = new Recipe({
        title,
        description,
        ingredients,
        difficulty,
        cuisine,
        nutri_info,
        image: {
            url: cloudinaryUpload.secure_url,
            publicId: cloudinaryUpload.public_id,
          },
        tags,
      });
  
      // Save the recipe to the database
      await newRecipe.save();
  
      res.status(201).json({ msg: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  };

const getRecipe = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json({ recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      ingredients,
      difficulty,
      cuisine,
      nutri_info,
      
      tags,
    } = req.body;
    const image = req.file.path;

    // Upload image to Cloudinary (if provided)
    let updatedImage = null;
    if (image) {
      const cloudinaryUpload = await uploadToCloudinary(
        image,
        {
          folder: 'recipes', // Specify the folder where the image should be stored in Cloudinary
        }
      );
      updatedImage = cloudinaryUpload.secure_url; // Store the secure URL of the uploaded image
    }

    // Find and update the recipe
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      {
        title,
        description,
        ingredients,
        difficulty,
        cuisine,
        nutri_info,
        ...(updatedImage && { image: updatedImage }), // Only update the image if it was provided
        tags,
      },
      { new: true } // Return the updated recipe
    );

    if (!updatedRecipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }

    res.json({ msg: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const deleteRecipe = async (req, res) => {
    try {
      // Delete all recipes from the database
      await Recipe.deleteMany();
  
      // Delete images from the specific folder in Cloudinary
    await deleteAllFromCloudinary('recipes');
  
      res.json({ msg: 'All recipes and associated images deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  };

const deleteRecipeById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedRecipe = await Recipe.findByIdAndDelete(id);
  
      if (!deletedRecipe) {
        return res.status(404).json({ msg: 'Recipe not found' });
      }
  
      // Delete the Cloudinary image associated with the recipe
      await deleteFromCloudinaryById(deletedRecipe.image.publicId);
  
      res.json({ msg: 'Recipe deleted successfully', recipe: deletedRecipe });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server Error' });
    }
  };
  
  module.exports = {
    deleteRecipeById,
  };

module.exports = {
  createRecipe,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  deleteRecipeById,
};
