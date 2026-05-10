var mongoose = require('mongoose');

let userRecipeSchema = new mongoose.Schema({
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
    },
    email: {
        type: String,
    }
});

module.exports = mongoose.model('user_recipe', userRecipeSchema);