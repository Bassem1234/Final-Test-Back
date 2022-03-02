const express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();
bcrypt = require('bcrypt');
//require model
const Abonne = require('../models/abonne');
const Livre = require('../models/livre');

//get the list of abonnes from a database
router.get('/abonnes', passport.authenticate('bearer', {session: false}),async (req, res) => {
    try {
        const abonne = await Abonne.find({});
        res.json(abonne);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//add a new abonne
router.post('/abonnes', passport.authenticate('bearer', {session: false}),async (req, res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        const createdAb = await Abonne.create({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password: hashedPwd
        });
        res.json(createdAb);
        // console.log(createdAb);
        //console.log(hashedPwd)
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//get an abonne by Id
router.get('/abonnes/:id', passport.authenticate('bearer', {session: false}),async (req, res) => {
    try {
        const abonne = await Abonne.findById(req.params.id);
        res.json(abonne);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//update an abonne by id
router.put('/abonnes/:id', passport.authenticate('bearer', {session: false}), async (req, res) => {
    try {
        const abToUpdate = await Abonne.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(abToUpdate);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//delete an abonne
router.delete('/abonnes/:id', passport.authenticate('bearer', {session: false}),async (req, res) => {
    try {
        const abToDelete = await Abonne.findByIdAndDelete(req.params.id);
        res.json(abToDelete);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//download a file 
router.post('/download/:id', passport.authenticate('bearer', {session: false}),async (req, res) => {
    try {
        const abonne = await Abonne.findById(req.params.id);
        if (abonne.livreTelecharge >= 5) {
            res.json('You have reached the limit of downloaded books');
            console.log('You have reached the limit of downloaded books')
        }
        else {
            abonne.livreTelecharge += 1;
            const livre = await Livre.findOne({ Contenue: req.body.filename });
            livre.DowTimes += 1;
            await Livre.findByIdAndUpdate(livre.id, livre);
            await Abonne.findByIdAndUpdate(req.params.id, abonne);
            filepath = path.join(__dirname, '../upload') + '/' + req.body.filename;
            res.sendFile(filepath);
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;