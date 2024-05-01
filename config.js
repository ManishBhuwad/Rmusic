const mongoose = require('mongoose')

const dbconnection = (url)=>{
    return mongoose.connect(url)
}

module.exports = dbconnection

