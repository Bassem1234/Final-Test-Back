const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const abonSchema = new Schema({
    fName:{type:String, required: true},
    lName:{type:String, required: true},
    email:{type:String, required: true},
    password: {type:String, required:true},
    profile: {type: String, default: 'abonne'},
    livreTelecharge: {type: Number, default: 0}
});

const Abone = mongoose.model('abone', abonSchema);
module.exports = Abone;