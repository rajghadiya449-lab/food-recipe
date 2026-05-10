var mongoose = require('mongoose');

var userLoginSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String }
}) 

module.exports = mongoose.model('user_login' , userLoginSchema)