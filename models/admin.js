const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    fName:String,
    lName:String,
    email:String,
    password:{type:String,required:true},
    profile: {type: String, default: 'admin'}
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;