const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const Song = require('../models/songmodel');
const upload  = require('../midleware/multer');




router.post('/upload', upload.fields([{name:"image"}, {name:"audio"}]) , async(req, res)=>{4
  console.log(req.protocol)
  const basePath = `${req.protocol}://${req.get('host')}/public/`
  const imagename = req.files.image[0].filename;
  const audioname = req.files.audio[0].filename;

  const response = await new Song({
    title:req.body.title,
    artist: req.body.artist,
    genre : req.body.genre,
    coverImage : `${basePath}${imagename}`,
    audiolink: `${basePath}${audioname}`,
    localAudioPath: audioname
  })
  
  response.save()
  res.json(response).status(200)
})



module.exports = router