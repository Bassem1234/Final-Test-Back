const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
passport = require('passport');

// fileUpload = require('express-fileupload');
//multer Storage Options
const myStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upload')
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() +  path.extname(file.originalname);
        cb(null, newFileName);
    }
});


const fileFilterFunction = (req, file, cb) => {
const fileExtension = path.extname(file.originalname);
const allowedExtension = ['.pdf'];
cb(null, file.extname(allowedExtension.includes(fileExtension)))
}
const maxSize = 1*1024*1024;
const Multer = multer({ storage: myStorage, limits: {fileSize: maxSize}});

router.post('/upload', Multer.single('file'), async (req, res) => {
console.log(req.file);
        if(req.file !== undefined){
            res.send({ message: 'File uploaded successfully'});
        }
        else {
            res.status(400).send({message: 'File not uploaded'})
        }
});


module.exports = router;