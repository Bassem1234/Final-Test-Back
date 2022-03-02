const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
passport = require('passport');



router.post('/download', async (req, res) =>{
filepath = path.join(__dirname, '../upload') + '/' + req.body.filename;
res.sendFile(filepath);
});