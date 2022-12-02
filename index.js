const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
// To laod environment variables
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });


const app = express();
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({ extended: true})); 
const uri =
    process.env.URI

mongoose.connect(uri)
        .then(()=>console.log("Connected"))
        .catch(error=>console.log("error"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single("video");

const { exec } = require("node:child_process");

app.get("/", (req, res) => {
  res.send("MPD generator");
});

app.post("/upload", (req, res) => {
  

  upload(req, res, (err) => {
    let file = req.file.filename;
    if (err) {
      console.log("Error while uploading");
    }
    res.send("Video processing");
    let filename = file.split(".")[0];
    const folderName = `segments/${filename}`;
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }
    filename = filename.split(".")[0];
    let cmd = `ffmpeg -re -i ./uploads/${filename}.mp4 -map 0 -map 0 -map 0 -c:a aac -c:v libx264 -b:v:1 800k -b:v:2 500k -s:v:0 1920x1080 -s:v:1 1280x720 -s:v:2 720x480 -profile:v:1 baseline -profile:v:2 baseline -profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0 -b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 -adaptation_sets "id=0,streams=v id=1,streams=a" -f dash ./segments/${filename}/${filename}_out.mpd`;

    exec(cmd, (err, output) => {
      if (err) {
        console.error("could not execute command: ", err);
        return;
      }
      console.log("Mpd file has been generated");
    });
  });
});

app.listen(4000, () => {
  console.log(`Listening on http://localhost:4000`);
});