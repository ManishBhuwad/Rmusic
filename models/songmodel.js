const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    artist:{
        type:String,
        required:true
    },
    genre:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
    
    },
    audiolink:{
        type:String,
        required: true
    },
    localAudioPath:{
        type: String,
        required: true
    }
})


const Song = mongoose.model('Song', songSchema)

module.exports = Song