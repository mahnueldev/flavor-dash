const mongoose = require('mongoose');

const RecipeSchema = mongoose.Schema({
  title: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
  ingredients: {
    type: String,
    
  },
  difficulty: {
    type: String,
    
  },
  cuisine: {
    type: String,
    
  },
  nutri_info: {
    type: String,
    
  },
  image: {
    publicId: {type:String, required:true},
    url:{type:String, required:true},
  },
  tags: {
    type: String,
    
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('recipe', RecipeSchema);
