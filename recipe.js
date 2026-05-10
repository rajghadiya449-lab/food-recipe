var mongoose = require('mongoose');

let recipeSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    ingredients: {
        type: Array
    },
    category: {
        type: String,
        enum: ["Thai", "American", "Chines", "Mexican", "Indian", "Spanish"],
    },
    image: {
        type: String,
    },
    username: {
        type: String,
        default: 'Cooking Blog With Priyank',
    },
});

module.exports = mongoose.model('recipe', recipeSchema);