express = require('express');
const passport = require('passport');
const path = require('path');
const router = express.Router();
const Admin = require('../models/admin');

router.post('/admin',async (req,res) => {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
       const createdAd = await Admin.create({
           fName: req.body.fName,
           lName: req.body.lName,
           email: req.body.email,
           password:  hashedPwd
       });
       res.json(createdAd);
       console.log(createdAd);
    }
    catch (err){
       console.log(err);
       res.status(500).json({ message: 'Internal server error'});
   }
});

module.exports = router;