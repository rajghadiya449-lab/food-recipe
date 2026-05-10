var mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({
    name: {
        type: String,

    },
    image: {
        type: String,
        
    }
});

module.exports = mongoose.model('category', categorySchema) 