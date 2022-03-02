const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Livre = require('./livre');
const categorySchema = new Schema({
    nomcategorie: {type:String, required:true}, 
    listeDesLivres: []
});

const Category = mongoose.model('category', categorySchema);
module.exports = Category;