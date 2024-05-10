const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
const fs = require('fs')
const { error } = require('console')
const dbconnection = require('./config')
// const router = require('./controller/song2')
const router = require('./controller/song')
const bodyParser = require('body-parser');
const Song = require('./models/songmodel')

require('dotenv').config()
dbconnection(process.env.DB_URL)
.then(conn=>console.log('db connected successfully'))
.catch(err=>console.log('db connection error:' , err))

const app = express();
const server = http.createServer(app)
const io = new Server(server)

app.use('/public', express.static('public'));

app.use(cors())
// app.use(bodyParser.urlencoded({ extended: true }));                            
app.use(bodyParser.json());

const folderPath = 'songs'


app.use(router)

app.get("/",(req, res)=>{
    return res.send("this is something from server")

})



app.get('/all-audio',async(req, res)=>{
    
    const allsongs = await Song.find({})
    
    return res.json(allsongs).status(200)
})




const rooms = new Map()

io.on('connection',(socket)=>{
   


    socket.on('joinRoom',(roomId)=>{
        const {roomName, username} = roomId;
        
        if(rooms.has(roomName)){
            // console.log("room has", roomName)
            rooms.get(roomName).add(socket.id)
            socket.join(roomName)
            socket.emit('userjoining',roomName);
        }
    })


    socket.on('handshake',roomId=>{
        if(rooms.has(roomId)){
            // console.log("room has", roomId)
            rooms.get(roomId).add(socket.id)
            socket.join(roomId)
            socket.to(roomId).emit('userJoined',{userId: socket.id});
        }else{
            // console.log("no room id")
        }
       
    })

    socket.on('playsong', (roomId, songId)=>{
        
        io.to(roomId).emit('clearAudio')

        if(songId){
           const song =  playSong(songId, roomId)
          
        }        
    })

    socket.on('handleplay',(flag,roomId)=>{
        console.log(flag)
        io.to(roomId).emit('playPause',flag)
    })
   

   

    const playSong = async(songId, roomId)=>{
        const song = await Song.findById(songId).select('localAudioPath')
        // console.log(song)
        if(song.localAudioPath){
            const filePath = `./public/${song.localAudioPath}`
        
            const stat = fs.statSync(filePath)
            // console.log(stat)
            const fileSize = stat.size;
            const readStream = fs.createReadStream(filePath);
            readStream.on('data', (chunk) => {
                // console.log(chunk)
                // console.log(roomId)
                io.to(roomId).emit('audioChunk', chunk);
            });

            // readStream.on('end', () => {
            //     io.to(roomI).emit('audioEnd', "audio has ended here")
            // })
        }

    }

    socket.on('createRoom',(roomid)=>{
        // console.log(roomid)
       const{roomName, username} = roomid

        if(!rooms.has(roomName)){
            rooms.set(roomName, new Set())
            console.log(rooms)
            rooms.get(roomName).add(username, socket.id)
            socket.join(roomName)
            socket.emit('roomCreated',roomName)

        }
        // console.log(rooms)
    })


    


    socket.on('disconnect',()=>{
        console.log('user is disconnected', socket.id)

        rooms.forEach((users, room)=>{
            if(users.has(socket.id)){
                users.delete(socket.id)
                io.to(room).emit('user left', socket.id)
                if(users.size === 0 ){
                    rooms.delete(room);
                }
            }
        })
    })
})








const PORT = process.env.PORT || 3000
server.listen(PORT, ()=>{
    console.log(`server is listening at ${PORT}`)
})