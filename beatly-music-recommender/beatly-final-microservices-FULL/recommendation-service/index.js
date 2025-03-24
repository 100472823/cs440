// recommendation-service/index.js
const express = require("express");
const app = express();
const PORT = 3003;

app.use(express.json());

// Example: GET /recommendations/trending
app.get("/recommendations/trending", (req, res) => {
  const trending = [
    { title: "Song A", artist: "Artist A", genre: "Pop" },
    { title: "Song B", artist: "Artist B", genre: "Rock" }
  ];
  res.json(trending);
});

// GET /recommendations/:username
app.get("/recommendations/:username", (req, res) => {
  const { username } = req.params;
  // Simple example returning a hardcoded array
  const recommended = [
    { title: "Song A", artist: "Artist A", genre: "Pop" },
    { title: "Song X", artist: "Artist X", genre: "Rock" }
  ];
  // Or you can read user’s liked songs from user-service, filter, etc. 
  res.json({ recommendedSongs: recommended, user: username });
});

app.listen(PORT, () => {
  console.log(`Recommendation Service running on port ${PORT}`);
});
