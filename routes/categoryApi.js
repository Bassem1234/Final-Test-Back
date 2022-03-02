const express = require('express');
const passport = require('passport');

const router = express.Router();

//require model
const Category = require('../models/category');
const Livre = require('../models/livre');

//get the list of categories from a database
router.get('/categories' ,passport.authenticate('bearer', {session: false}),async (req,res) => {
    try{
        const category = await Category.find({});
        res.json(category);
    }
     catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
     }
});


//add a new category
router.post('/categories', passport.authenticate('bearer', {session: false}),async (req,res) => {
     try {
        const createdCat = await Category.create(req.body);
        res.json(createdCat);
        console.log(req.body);
     }
     catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//get an category by Id
router.get('/categories/:id',passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json(category);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});



//update a category by id
router.put('/categories/:id',passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const catToUpdate = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(catToUpdate);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//delete a category
router.delete('/categories/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const cat = await Category.findById(req.params.id);
        const catName = cat.nomcategorie;
        const livres = await Livre.find({});
        for(let i=0; i< livres.length; i++){
            if(livres[i].category == catName){
                await Livre.findByIdAndDelete(livres[i].id);
                console.log(livres[i].id)
            }
        }

        const catToDelete = await Category.findByIdAndDelete(req.params.id);
        res.json(catToDelete);
    }
    catch (err){
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

module.exports = router;