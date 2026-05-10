var mongoose = require('mongoose');

var loginSchema = new mongoose.Schema({
    email : { type:String },
    password : { type:String }
});

module.exports = mongoose.model('login', loginSchema);  


