const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();
const multer = require('multer');

//require model
const Livre = require('../models/livre');
const Category = require('../models/category');

//storage for file
const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, file.originalname);
    }
});
// filter function for image upload
const fileFilterFunction = (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const allowedExtension = ['.pdf'];
    cb(null, file.extname(allowedExtension.includes(fileExtension)))
}
const maxSize = 1 * 1024 * 1024;
const Multer = multer({ storage: myStorage });


//get the list of categories from a database
router.get('/livres', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const livre = await Livre.find({});
        res.json(livre);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//add a new Livre
router.post('/livres/:name', [passport.authenticate('bearer', { session: false }), Multer.single('file')], async (req, res) => {
    try {
        if (req.file !== undefined) {
            console.log({ message: 'File uploaded successfully' });
        }
        else {
            console.log({ message: 'File not uploaded' })
        }
        const catego = await Category.findOne({ nomcategorie: req.params.name });
        await Category.findByIdAndUpdate(catego.id, { $push: { listeDesLivres: req.body } });
        const createdliv = await Livre.create(req.body);
        res.json(createdliv);
        console.log(req.file);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//get an Livre by Id
router.get('/livres/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const livre = await Livre.findById(req.params.id);
        res.json(livre);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//update a Livre by id
router.put('/livres/:id', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        const livToUpdate = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(livToUpdate);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete a Livre
router.delete('/livres/:id/:catName', passport.authenticate('bearer', { session: false }), async (req, res) => {
    try {
        
        const liv = await Livre.findById(req.params.id);
        const livreDelete = await Livre.findByIdAndDelete(req.params.id);
        const category = await Category.findOne({ nomcategorie: req.params.catName });
        const livreList = await category.listeDesLivres;
        for(let i=0; i< livreList.length; i++){
            if(livreList[i].Titre == liv.Titre){
                livreList.splice(i,1);
            }
        }
       await Category.findOneAndUpdate({ nomcategorie: req.params.catName }, {$set:{listeDesLivres: livreList}});
        //res.json(livreDelete);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;