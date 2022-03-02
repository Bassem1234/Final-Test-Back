const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const livreSchema = new Schema({
    Titre:{type: String, required:true},
    Auteur:{type: String, required:true},
    Description:{type: String, required:true},
    Contenue: String,
    DowTimes: {type:Number, default:0},
    category : String
});

const Livre = mongoose.model('livres', livreSchema);
module.exports = Livre;