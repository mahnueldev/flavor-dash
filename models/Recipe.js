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
    enum: ['easy', 'medium', 'hard'],
    default: null
  },
  cuisine: {
    type: String,
    enum: ['Italian', 'Mexican', 'Chinese'],
    default: null
    
  },
  nutri_info: {
    type: [String],
  },
  image: {
    publicId: {type:String, required:true},
    url:{type:String, required:true},
  },
  tags: {
    type: String,
    enum: [
      'Vegetarian',
      'Vegan',
      'Gluten-Free',
      'Dairy-Free',
      'Nut-Free',
      'Low Carb',
      'High Protein',
      'Keto',
      'Paleo',
      'Comfort Food',
      'Quick and Easy',
      'Breakfast',
      'Lunch',
      'Dinner',
      'Appetizer',
      'Dessert'
    ],
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('recipe', RecipeSchema);
