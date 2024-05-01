const multer = require('multer')

const FILE_TYPES = {
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    "audio/mp3" :"mp3",
    "audio/mpeg" :"mp3",
    "audio/wav" : "wav",
    "audio/mp4" : "mp4"
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = FILE_TYPES[file.mimetype]
      cb(null, file.fieldname + '-' + uniqueSuffix + "." +extension)
    }
  })

const upload = multer({ storage: storage })

module.exports = upload