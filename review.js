var mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema({

    recipeId: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    rating: {
        type: String,
    },
    comment: {
        type: String,
    },
    otp: {
        type: String,
    }
});

module.exports = mongoose.model('review', reviewSchema) 