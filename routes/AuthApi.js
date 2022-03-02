const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//require model
const User = require('../models/user');
const Abonne = require('../models/abonne');
const Admin = require('../models/admin');

// require bcrypt and require the salt
const bcrypt = require('bcrypt');
router.post('/register', async (req, res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email });
        const abonFound = await Abonne.findOne({ email: req.body.email });
        const adminFound = await Admin.findOne({ email: req.body.email });
        if (userFound || abonFound || adminFound) {
            res.send({ message: 'email already exists, please choose another email' });
        }

        else {
            const hashedPwd = await bcrypt.hash(req.body.password, 10);
            if (req.body.profile == 'User') {
                const createdUser = await User.create({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    email: req.body.email,
                    password : hashedPwd,
                    profile: req.body.profile
                });
                res.json(createdUser);
            }
            else {
                const createdAbonne = await Abonne.create({
                    fName: req.body.fName,
                    lName: req.body.lName,
                    email: req.body.email,
                    password : hashedPwd,
                    profile: req.body.profile
                });
                createdAbonne.password = hashedPwd; 
                res.json(createdAbonne);
            }
            
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        const abonne = await Abonne.findOne({email: req.body.email});
        const admin = await Admin.findOne({email: req.body.email});
    
        if (user) {
             const cmp = await bcrypt.compare(req.body.password, user.password);
            // console.log(cmp)
            console.log(req.body.password)
            if(cmp) {
                // create jwt token
                const tokenData = {
                    userId: user._id,
                    email: user.email
                };
                const token = jwt.sign(tokenData, process.env.JWT_Secret, {expiresIn: process.env.JWT_EXPIRE});
                res.send({message: 'Auth Successful', token: token, user: user, profile: 'user'});
            } 
            else {
                res.send({message: "Wrong email or password"});
            }
        }
        else if(abonne){
            const cmp = await bcrypt.compare(req.body.password, abonne.password);
            if(cmp) {
                //create jwt token
                const tokenData = {
                    abonneId: abonne._id,
                    email: abonne.email
                }
                const token = jwt.sign(tokenData, process.env.JWT_Secret, {expiresIn: process.env.JWT_EXPIRE});
                res.send({message: 'Auth Sucessful', token: token, user: abonne, profile: 'abonne'});
            }
            else {
                res.send({message: "Wrong email or password"});
            }
        }
        else if(admin){
            const cmp = await bcrypt.compare(req.body.password, admin.password);
            if(cmp) {
                //create jwt token
                const tokenData = {
                    adminId: admin._id,
                    email: admin.email
                }
                const token = jwt.sign(tokenData, process.env.JWT_Secret, {expiresIn: process.env.JWT_EXPIRE});
                res.send({message: 'Auth Sucessful', token: token, user: admin, profile:'admin'});
            }
            else {
                res.send({message: "Wrong email or password"});
            }
        }
        else {
            res.send({message: "Wrong email or password"});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error occured");
    }
});

module.exports = router;