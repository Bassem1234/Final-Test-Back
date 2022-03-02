const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fName:String,
    lName:String,
    email:String,
    password: String,
    profile: {type: String, default: 'User'}
});

const User = mongoose.model('user', userSchema);
module.exports = User;