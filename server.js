const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const locations = {};

app.post('/update-location', (req, res) => {
  const { userId, lat, lng } = req.body;
  if (!userId || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid data' });
  }
  locations[userId] = { lat, lng };
  res.sendStatus(200);
});

app.get('/locations', (req, res) => {
  res.json(locations);
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
