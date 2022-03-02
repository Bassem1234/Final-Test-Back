const express = require('express');
const passport = require('passport');
bcrypt = require('bcrypt');
const router = express.Router();

//require model
const User = require('../models/user')

//get the list of users from a database
router.get('/users' ,passport.authenticate('bearer', {session: false}),async (req,res) => {
    try{
        const users = await User.find({});
        res.json(users);
    }
     catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
     }
});


//add a new user
router.post('/users',passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
         const createdUs = await User.create({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            password : hashedPwd
        });
        res.json(createdUs);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});


//get an category by Id
router.get('/users/:id',passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});



//update a category by id
router.put('/users/:id',passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const UsToUpdate = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(UsToUpdate);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

//delete a user
router.delete('/users/:id', passport.authenticate('bearer', {session: false}),async (req,res) => {
    try {
        const usToDelete = await User.findByIdAndDelete(req.params.id);
        res.json(usToDelete);
    }
    catch {
        console.log(err);
        res.status(500).json({ message: 'Internal server error'});
    }
});

module.exports = router;