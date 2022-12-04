const Video = require("../models/video");
const express = require("express");
const multer = require("multer");


const getVideos = async (req, res) => {
    const videoList = await Video.find();
    if (!videoList) {
      res.status(500).json({
        success: false,
      });
    }
    res.send(videoList);
  };


  
module.exports = {
    getVideos
}