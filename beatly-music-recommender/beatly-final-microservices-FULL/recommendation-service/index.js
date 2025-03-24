// recommendation-service/server.js
const express = require('express');
const app = express();
const PORT = 3003;

// Example: Hardcoded trending songs (or store in a separate JSON)
const trendingSongs = [
  { title: 'Song A', artist: 'Artist A', genre: 'Rock' },
  { title: 'Song B', artist: 'Artist B', genre: 'Pop' },
  { title: 'Song C', artist: 'Artist C', genre: 'Jazz' }
];

app.use(express.json());

// Example route: get trending songs
app.get('/recommendations/trending', (req, res) => {
  return res.json(trendingSongs);
});

// Example route: get personalized recommendations
app.get('/recommendations/:username', (req, res) => {
  const { username } = req.params;
  // In a real app, you'd fetch user’s liked songs from User Service and do logic.
  // For demonstration, we’ll just return the same trending songs:
  return res.json({
    user: username,
    recommendedSongs: trendingSongs
  });
});

app.listen(PORT, () => {
  console.log(`Recommendation Service running on port ${PORT}`);
});
