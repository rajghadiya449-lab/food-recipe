var mongoose = require('mongoose');

let verifySchema = new mongoose.Schema({
    email: {
        type: String,
    },
    token: {
        type: String,
    }
});

module.exports = mongoose.model('verification', verifySchema) 