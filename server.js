const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Use PORT from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files (index.html, etc.) from root
app.use(express.static(path.join(__dirname)));

const locations = {};

// Endpoint to update location
app.post('/update-location', (req, res) => {
  const { userId, lat, lng } = req.body;
  if (!userId || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid data' });
  }
  locations[userId] = { lat, lng, timestamp: Date.now() };
  res.sendStatus(200);
});

// Endpoint to get all locations
app.get('/locations', (req, res) => {
  res.json(locations);
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
