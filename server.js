const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server,{ cors:{ origin:'*' }});

// Serve files from root directory
app.use(express.static('.'));

const locations = {};

io.on('connection',(socket)=>{
  console.log('Client connected')

  socket.on('location',(data)=>{
    locations[data.userId] = { lat: data.lat, lng: data.lng };
    io.emit('locations', locations);
  });

  socket.on('disconnect',()=>{
    console.log('Client disconnected')
    // You could delete their location here if you wish
  })
});

// Listen on port
const port = process.env.PORT || 3000;
server.listen(port,()=> console.log(`Server listening on port ${port}`))
