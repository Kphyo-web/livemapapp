const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);

// Use PORT from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (GitHub frontend will connect)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// (Optional if serving frontend from Glitch  youre using GitHub Pages)
app.use(express.static(path.join(__dirname)));

// Track all connected users' locations
const locations = {};
const socketToUser = {}; // Map socket.id to userId

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log(` New user connected: ${socket.id}`);

  // When a user sends location data
  socket.on('updateLocation', ({ userId, lat, lng }) => {
    if (!userId || typeof lat !== 'number' || typeof lng !== 'number') return;

    // Save userId to socketId mapping
    socketToUser[socket.id] = userId;

    // Save/update location
    locations[userId] = {
      lat,
      lng,
      timestamp: Date.now(),
      socketId: socket.id
    };

    // Broadcast updated location list to all clients
    io.emit('locations', locations);
  });

  // Send existing locations to newly connected client
  socket.emit('locations', locations);

  // When user disconnects
  socket.on('disconnect', () => {
    console.log(` User disconnected: ${socket.id}`);
    const userId = socketToUser[socket.id];

    if (userId) {
      delete locations[userId];
      delete socketToUser[socket.id];
      io.emit('locations', locations); // Notify remaining clients
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(` Server is running at http://localhost:${PORT}`);
});