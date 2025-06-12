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
    origin: "*", // Allow all origins (or specify yours)
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve static frontend files (optional if using GitHub Pages)
app.use(express.static(path.join(__dirname)));

// Track all connected users' locations
const locations = {};

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log(`🟢 New user connected: ${socket.id}`);

  // Receive location updates from a user
  socket.on('updateLocation', ({ userId, lat, lng }) => {
    if (!userId || typeof lat !== 'number' || typeof lng !== 'number') return;

    locations[userId] = { lat, lng, timestamp: Date.now() };

    // Broadcast updated location to all clients
    io.emit('locations', locations);
  });

  // Send all existing locations to the newly connected user
  socket.emit('locations', locations);

  socket.on('disconnect', () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
