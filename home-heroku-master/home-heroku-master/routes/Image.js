
const express = require('express'),
    fs = require('fs'),
    image = express.Router(),
    multer = require("multer"),
    path = require("path"),
    Home = require('../model/Home'),
    imgSchema = require('../model/Image')
// { imageValidate }= require('../validator/Image_valid')

// const server = `http://localhost:4444`;
const server = 'https://ok-myhome.herokuapp.com'

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            "_" +
            file.originalname
                .split(" ")
                .join()
                .replace(",", "_")
        );
    }
});
checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb("images only");
    }
};

let uploader = multer({
    storage,
    limits: { fileSize: 100000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
})



image.get('/upload/:path', (req, res) => {
    return res.sendFile(req.params.path, { root: "uploads/" });
})
image.post('/upload', uploader.array('file'), async (req, res) => {
    const newhome = await Home.find(this.all)
    const id = newhome.length
    // console.log(newhome);
    console.log(req.files);
    console.log(req.protocol + ' ' + req.get('host'));

    if (files.length < 1) {
        res.json({ message: 'no file' })
    }
    else {

        if (req.files == undefined) {
            res.json({ message: "error", details: "no file selected" });
        }
        else {
            const files = req.files
            const urlImage = []
            for (const key in req.files) {
                if (key) {
                    // console.log(files[key].filename);
                    urlImage.push(`${server}/uploads/upload/${files[key].filename}`)
                }
            }
            const img = new imgSchema({
                id: id > 0 ? newhome[id - 1].id + 1 : +id,
                // img: `${server}/uploads/upload/${files[key].filename}`
                img: urlImage
            })
            const savedImg = img.save()

            res.send(urlImage)

        }

    }
})

module.exports = image
    // module.exports.uploader = uploader