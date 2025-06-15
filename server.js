const express = require('express')
const http = require('http')
const socketIo = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIo(server,{ cors:{ origin:'*'}})

// Serve static files if you have a "public" directory
app.use(express.static('public'));

io.on('connection',(socket)=>{
  console.log('Client connected')

  socket.on('location',(data)=>{
    // Broadcast this location to all other clients
    socket.broadcast.emit('location',data);
  });

  socket.on('disconnect',()=>{
    console.log('Client disconnected');
  })
});

// Listen on port (Glitch typically uses process.env.PORT)
const port = process.env.PORT || 3000;
server.listen(port,()=> console.log(`Server listening on port ${port}`))
