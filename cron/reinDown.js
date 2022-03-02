const express = require('express');
const router = express.Router();
const cron = require('node-cron');
const Abonne = require('../models/abonne');

//Reinitialize downloaded books number every 1 month
cron.schedule("* * * * 1 * *", async() => {
    const abonne = await Abonne.find({});
    abonne.forEach(async element => {
         element.livreTelecharge =0;
         await Abonne.findByIdAndUpdate(element.id, element)
         console.log('you can now download books');
    });
});


//Reinitialize downloaded books number every 5 minutes: to make test easier
cron.schedule("5 * * * * *", async () =>{
const abonne = await Abonne.find({});
abonne.forEach(async element => {
     element.livreTelecharge =0;
     await Abonne.findByIdAndUpdate(element.id, element)
     console.log('you can now download books');
    });
});

module.exports = router;